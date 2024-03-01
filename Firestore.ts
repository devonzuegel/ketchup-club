import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import {store, StoreState} from './Store'

type Unsubscribe = () => void

export interface User {
  uid: string
  name: string
  phone: string
  status?: status
  location?: {
    city: string
    region: string
    country: string
    visibility?: string
  }
}

interface status {
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
  private onlineFriendsUnsubscriber: Unsubscribe | null = null
  private userUnsubsriber: Unsubscribe | null = null
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

  private async checkIfUserStatusIsExpired(u: User) {
    if (u.status?.online && u.status?.expiry.toMillis() < Date.now()) {
      console.log('user status is expired')
      const {removeOnlineFriend} = store.getState() as StoreState
      removeOnlineFriend(u.uid)
      const {user} = store.getState() as StoreState
      if (u.uid == user?.uid) {
        fs.setStatusOffline()
      }
    }
  }

  private subscribeToFirestore(): void {
    auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.friendsUnsubscriber = this.subscribeToFriendsInFirestore()
        this.userUnsubsriber = this.subscribeToLoggedInUserInFirestore(user)
        this.onlineFriendsUnsubscriber = this.subscribeToOnlineFriendsInFirestore()
      } else {
        // No user is signed in.
        // destroy database subscriptions
        store.setState((state: StoreState) => {
          state.setUser(null)
          state.setFriends([])
          state.setOnlineFriends([])
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
        if (this.onlineFriendsUnsubscriber) {
          this.onlineFriendsUnsubscriber()
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
        }))
        store.setState({friends: users})
      })
    return subscriber
  }

  private subscribeToOnlineFriendsInFirestore(): Unsubscribe {
    const subscriber = firestore()
      .collection('users')
      .where('status.online', '==', true)
      .where('status.expiry', '>', firestore.Timestamp.now())
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot) {
          // console.log('no Online Friends querySnapshot')
          return
        }
        console.log('getting data about onlineFriends:', querySnapshot.docs.length)
        const users = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as User),
          uid: doc.id,
        }))
        for (const u of users) {
          if (u.status?.expiry && u.status?.expiry.toMillis() > Date.now()) {
            const timer = setTimeout(() => {
              this.checkIfUserStatusIsExpired(u)
              this.timers.delete(u.uid)
            }, u.status?.expiry.toMillis() - Date.now())
            if (this.timers.has(u.uid)) {
              clearTimeout(this.timers.get(u.uid) as NodeJS.Timeout)
            }
            this.timers.set(u.uid, timer)
          }
        }
        store.setState({onlineFriends: users})
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
        const u = {...(doc.data() as User), uid: doc.id}
        store.setState({user: u})
      })
    return subscriber
  }

  public publishLocation(location: {city: string; region: string; country: string; visibility?: string}): void {
    // console.log('publishLocation in firestore:', location)
    const {user} = store.getState() as StoreState
    // console.log('user:', user)
    if (user) {
      if (!location.visibility) {
        location = {...location, visibility: 'public'}
      }
      firestore().collection('users').doc(user.uid).update({location})
    }
  }

  public setStatusOnline(expiry?: FirebaseFirestoreTypes.Timestamp, visibility?: string): void {
    const {user} = store.getState() as StoreState
    if (user) {
      let status = new Object() as statusForPublishing
      status.online = true
      status.went_online = firestore.FieldValue.serverTimestamp()
      if (expiry) {
        status.expiry = expiry
      }
      if (visibility) {
        status.visibility = visibility
      } else {
        status.visibility = 'public'
      }
      firestore().collection('users').doc(user.uid).update({
        status: status,
      })
    }
  }

  public setStatusOffline(): void {
    const {user} = store.getState() as StoreState
    if (user) {
      firestore().collection('users').doc(user.uid).update({status: firestore.FieldValue.delete()})
    }
  }
}

export const fs = Firestore.getInstance()
