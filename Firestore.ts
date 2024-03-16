import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import {store, StoreState} from './Store'
import {setStatusOffline} from './API'
import {User, Status, Location} from './API'

type Unsubscribe = () => void

class Firestore {
  private static instance: Firestore
  private friendsUnsubscriber: Unsubscribe | null = null
  private statusesUnsubscriber: Unsubscribe | null = null
  private locationsUnsubscriber: Unsubscribe | null = null
  private userUnsubsriber: Unsubscribe | null = null
  private locationUnsubscriber: Unsubscribe | null = null
  private statusUnsubscriber: Unsubscribe | null = null
  private timers = new Map<string, NodeJS.Timeout>()
  private uid: string | null = null

  private constructor() {
    console.log('firestore controller constructed')
    this.subscribeToFirestore()
  }

  public static getInstance(): Firestore {
    if (!Firestore.instance) {
      Firestore.instance = new Firestore()
      console.log('Firestore instance created')
    }
    return Firestore.instance
  }

  private async checkIfStatusIsExpired(status: Status) {
    if (status.online && status.expiry.toMillis() < Date.now()) {
      console.log('user status is expired')
      const {removeStatus} = store.getState() as StoreState
      removeStatus(status.uid)
      const {user} = store.getState() as StoreState
      if (status.uid == user?.uid) {
        setStatusOffline()
      }
    }
  }

  private subscribeToFirestore(): void {
    auth().onAuthStateChanged((user) => {
      if (user) {
        if (this.uid == user.uid) {
          return // sometimes this function fires more than once, but we don't want multiple subscribers for each query type
        }
        this.uid = user.uid
        // User is signed in.
        this.userUnsubsriber = this.subscribeToLoggedInUserInFirestore(user)
        this.statusUnsubscriber = this.subscribeToStatusInFirestore(user)
        this.locationUnsubscriber = this.subscribeToLocationInFirestore(user)
        this.friendsUnsubscriber = this.subscribeToFriendsInFirestore()
        this.statusesUnsubscriber = this.subscribeToFriendStatusesInFirestore()
        this.locationsUnsubscriber = this.subscribeToLocationsInFirestore()
      } else {
        // No user is signed in.
        // destroy database subscriptions
        store.setState((state: StoreState) => {
          this.uid = null
          state.setUser(null)
          state.setLocation(null)
          state.setStatus(null)
          state.setFriends([])
          state.setStatuses([])
          state.setLocations([])
          for (const t of this.timers.values()) {
            clearTimeout(t)
          }
          return {...state}
        })
        if (this.friendsUnsubscriber) {
          this.friendsUnsubscriber()
        }
        if (this.userUnsubsriber) {
          this.userUnsubsriber()
        }
        if (this.locationUnsubscriber) {
          this.locationUnsubscriber()
        }
        if (this.statusUnsubscriber) {
          this.statusUnsubscriber()
        }
        if (this.statusesUnsubscriber) {
          this.statusesUnsubscriber()
        }
        if (this.locationsUnsubscriber) {
          this.locationsUnsubscriber()
        }
      }
    })
  }

  private subscribeToFriendsInFirestore(): Unsubscribe {
    const subscriber = firestore()
      .collection('users')
      .where(firestore.FieldPath.documentId(), '!=', this.uid) // subbing for friends-only query
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot) {
          // console.log('no Friends querySnapshot')
          return
        }
        // console.log('getting data about friends:', querySnapshot.docs.length)
        const users = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as User),
          uid: doc.id,
        }))
        store.setState({friends: users})
      })
    return subscriber
  }

  private subscribeToLocationsInFirestore(): Unsubscribe {
    // console.log('subscribing to locations using uid:', this.uid)
    const subscriber = firestore()
      .collection('locations')
      .where(firestore.FieldPath.documentId(), '!=', this.uid) // subbing for friends-only query
      .where('visibility', 'array-contains-any', [this.uid, 'public'])
      // .where('visibility', 'array-contains', 'public')
      .onSnapshot((querySnapshot) => {
        // console.log('query snapshot:', querySnapshot)
        if (!querySnapshot) {
          // console.log('no locations querySnapshot')
          return
        }
        // console.log('getting data about locations:', querySnapshot.docs.length)
        const locations = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Location),
          uid: doc.id,
        }))
        querySnapshot.docs.forEach((doc) => {
          // console.log('location:', doc.data())
        })
        store.setState({locations: locations})
      })
    return subscriber
  }

  private subscribeToFriendStatusesInFirestore(): Unsubscribe {
    const subscriber = firestore()
      .collection('statuses')
      .where(firestore.FieldPath.documentId(), '!=', this.uid) // subbing for friends-only query
      .where('online', '==', true)
      // .where('visibility', 'array-contains', 'public')
      .where('visibility', 'array-contains-any', [this.uid, 'public'])
      .onSnapshot((querySnapshot) => {
        // console.log('query snapshot:', querySnapshot)
        if (!querySnapshot) {
          // console.log('no statuses querySnapshot')
          return
        }
        // console.log('getting data about statuses:', querySnapshot.docs.length)
        let statuses = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Status),
          uid: doc.id,
        }))
        statuses = statuses.filter((status) => status.expiry.toMillis() > Date.now())
        for (const status of statuses) {
          if (status.expiry && status.expiry.toMillis() > Date.now()) {
            const timer = setTimeout(() => {
              this.checkIfStatusIsExpired(status)
              this.timers.delete(status.uid)
            }, status.expiry.toMillis() - Date.now())
            if (this.timers.has(status.uid)) {
              clearTimeout(this.timers.get(status.uid) as NodeJS.Timeout)
            }
            this.timers.set(status.uid, timer)
          }
        }
        store.setState({statuses: statuses})
      })
    return subscriber
  }

  private subscribeToLoggedInUserInFirestore(user: FirebaseAuthTypes.User): Unsubscribe {
    const subscriber = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (!doc) {
          // console.log('no doc for user:', user.uid)
          return
        }
        // console.log('getting data for user:', user.uid)
        const u = {
          ...(doc.data() as User),
          uid: doc.id,
          // remove location and status from user object
          // location: undefined,
          // status: undefined,
        }
        store.setState({user: u})
      })
    return subscriber
  }

  private subscribeToLocationInFirestore(user: FirebaseAuthTypes.User): Unsubscribe {
    const subscriber = firestore()
      .collection('locations')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (!doc) {
          // console.log('no location for user:', user.uid)
          return
        }
        // console.log('getting location for user:', user.uid)
        const l = {
          ...(doc.data() as Location),
          uid: doc.id,
        }
        store.setState({location: l})
      })
    return subscriber
  }

  private subscribeToStatusInFirestore(user: FirebaseAuthTypes.User): Unsubscribe {
    const subscriber = firestore()
      .collection('statuses')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (!doc) {
          // console.log('no status for user:', user.uid)
          return
        }
        // console.log('getting status for user:', user.uid)
        const s = {
          ...(doc.data() as Status),
          uid: doc.id,
        }
        if (s.expiry && s.expiry.toMillis() > Date.now()) {
          const timer = setTimeout(() => {
            this.checkIfStatusIsExpired(s)
            this.timers.delete(s.uid)
          }, s.expiry.toMillis() - Date.now())
          if (this.timers.has(s.uid)) {
            clearTimeout(this.timers.get(s.uid) as NodeJS.Timeout)
          }
          this.timers.set(s.uid, timer)
        }
        store.setState({status: s})
      })
    return subscriber
  }
}

export const fs = Firestore.getInstance()
