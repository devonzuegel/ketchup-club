import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import {store, StoreState} from './Store'

type Unsubscribe = () => void

export interface RenderedUser {
  uid: string
  name: string
  phone: string
  status?: {
    online: boolean
    went_online?: FirebaseFirestoreTypes.Timestamp
    oncall?: boolean
    expiry: FirebaseFirestoreTypes.Timestamp
  }
  location?: {
    city: string
    region: string
    country: string
  }
}

export interface User {
  uid: string
  name: string
  phone: string
  // location?: FirebaseFirestoreTypes.DocumentReference
  // status?: FirebaseFirestoreTypes.DocumentReference
}

export interface Location {
  uid: string
  city: string
  region: string
  country: string
  visibility: string
}

export interface Status {
  uid: string
  online: boolean
  went_online?: FirebaseFirestoreTypes.Timestamp
  oncall?: boolean
  expiry: FirebaseFirestoreTypes.Timestamp
  visibility?: string
}

interface statusForPublishing {
  online: boolean
  went_online?: FirebaseFirestoreTypes.FieldValue
  oncall?: boolean
  expiry: FirebaseFirestoreTypes.FieldValue
  visibility?: string
}

class Firestore {
  private static instance: Firestore
  private friendsUnsubscriber: Unsubscribe | null = null
  // private onlineFriendsUnsubscriber: Unsubscribe | null = null
  private statusesUnsubscriber: Unsubscribe | null = null
  private locationsUnsubscriber: Unsubscribe | null = null
  private userUnsubsriber: Unsubscribe | null = null
  private locationUnsubscriber: Unsubscribe | null = null
  private statusUnsubscriber: Unsubscribe | null = null
  private timers = new Map<string, NodeJS.Timeout>()

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
        fs.setStatusOffline()
      }
    }
  }

  private subscribeToFirestore(): void {
    auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.userUnsubsriber = this.subscribeToLoggedInUserInFirestore(user)
        this.statusUnsubscriber = this.subscribeToStatusInFirestore(user)
        this.locationUnsubscriber = this.subscribeToLocationInFirestore(user)
        this.friendsUnsubscriber = this.subscribeToFriendsInFirestore()
        this.statusesUnsubscriber = this.subscribeToFriendStatusesInFirestore()
        this.locationsUnsubscriber = this.subscribeToLocationsInFirestore()
        // this.onlineFriendsUnsubscriber = this.subscribeToOnlineFriendsInFirestore()
      } else {
        // No user is signed in.
        // destroy database subscriptions
        store.setState((state: StoreState) => {
          state.setUser(null)
          state.setFriends([])
          // state.setOnlineFriends([])
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
        // if (this.onlineFriendsUnsubscriber) {
        //   this.onlineFriendsUnsubscriber()
        // }
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
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot) {
          // console.log('no Friends querySnapshot')
          return
        }
        console.log('getting data about friends:', querySnapshot.docs.length)
        const users = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as User),
          uid: doc.id,
          // remove location and status from user object
          location: undefined,
          status: undefined,
        }))
        store.setState({friends: users})
      })
    return subscriber
  }

  private subscribeToLocationsInFirestore(): Unsubscribe {
    const subscriber = firestore()
      .collection('locations')
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot) {
          // console.log('no Friends querySnapshot')
          return
        }
        console.log('getting data about locations:', querySnapshot.docs.length)
        const locations = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Location),
          uid: doc.id,
        }))
        store.setState({locations: locations})
      })
    return subscriber
  }

  private subscribeToFriendStatusesInFirestore(): Unsubscribe {
    const subscriber = firestore()
      .collection('statuses')
      .where('online', '==', true)
      .where('expiry', '>', firestore.Timestamp.now())
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot) {
          return
        }
        console.log('getting data about statuses:', querySnapshot.docs.length)
        const statuses = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Status),
          uid: doc.id,
        }))
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
          console.log('no doc for user:', user.uid)
          return
        }
        console.log('getting data for user:', user.uid)
        const u = {
          ...(doc.data() as User),
          uid: doc.id,
          // remove location and status from user object
          location: undefined,
          status: undefined,
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
          console.log('no location for user:', user.uid)
          return
        }
        console.log('getting location for user:', user.uid)
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
          console.log('no status for user:', user.uid)
          return
        }
        console.log('getting status for user:', user.uid)
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

  public publishLocation(location: {city: string; region: string; country: string; visibility?: string}): void {
    // console.log('publishLocation in firestore:', location)
    const {user} = store.getState() as StoreState
    // console.log('user:', user)
    if (user) {
      // let l: {} = {}
      // if (!location.visibility) {
      //   location = {...location, visibility: 'public'}
      // }
      firestore()
        .collection('locations')
        .doc(user.uid)
        .set({
          city: location.city,
          region: location.region,
          country: location.country,
          visibility: location.visibility ? location.visibility : 'public',
        })
    }
  }

  public removeLocation(): void {
    const {user} = store.getState() as StoreState
    if (user) {
      firestore().collection('locations').doc(user.uid).delete()
    }
  }

  public setStatusOnline(expiry?: FirebaseFirestoreTypes.Timestamp, visibility?: string): void {
    const {user} = store.getState() as StoreState
    if (user) {
      // let status = new Object() as statusForPublishing
      // status.online = true
      // status.went_online = firestore.FieldValue.serverTimestamp()
      // if (expiry) {
      //   status.expiry = expiry
      // }
      // if (visibility) {
      //   status.visibility = visibility
      // } else {
      //   status.visibility = 'public'
      // }

      firestore()
        .collection('statuses')
        .doc(user.uid)
        .set({
          online: true,
          went_online: firestore.FieldValue.serverTimestamp(),
          expiry: expiry,
          visibility: visibility ? visibility : 'public',
        })
    }
  }

  public setStatusOffline(): void {
    const {user} = store.getState() as StoreState
    if (user) {
      firestore().collection('statuses').doc(user.uid).delete()
    }
  }
}

export const fs = Firestore.getInstance()
