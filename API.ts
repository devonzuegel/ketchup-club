import firestore from '@react-native-firebase/firestore'
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import {store, StoreState} from './Store'
import {update} from 'lodash'

export interface RenderedUser {
  uid: string
  name: string
  phone: string
  status?: {
    online: boolean
    went_online: FirebaseFirestoreTypes.Timestamp
    oncall?: boolean
    expiry: FirebaseFirestoreTypes.Timestamp
  } | null
  location?: {
    city: string
    region: string
    country: string
  } | null
}

export interface User {
  uid: string
  name: string
  phone: string
  // location?: Location | null
  // status?: Status | null
}

export interface Location {
  uid: string
  city: string
  region: string
  country: string
  visibility: string[]
}

export interface Status {
  uid: string
  online: boolean
  went_online: FirebaseFirestoreTypes.Timestamp
  oncall?: boolean
  expiry: FirebaseFirestoreTypes.Timestamp
  visibility: string[]
}

export const publishLocation = async (location: {city: string; region: string; country: string}) => {
  const {user, locationVisibility} = store.getState() as StoreState
  if (user) {
    let visibility: string[] = []
    if (locationVisibility === 'friends') {
      visibility = await getArrayOfFriends()
    } else if (locationVisibility === 'public') {
      visibility = ['public']
    }
    firestore().collection('locations').doc(user.uid).set({
      city: location.city,
      region: location.region,
      country: location.country,
      visibility: visibility,
    })
  }
}

export const removeLocation = () => {
  const {user} = store.getState() as StoreState
  if (user) {
    firestore().collection('locations').doc(user.uid).delete()
  }
}

export const follow = (uid: string) => {
  const {user} = store.getState() as StoreState
  if (user && user.uid !== uid) {
    firestore().collection('users').doc(user.uid).collection('following').doc(uid).set({})
  }
  updateLocationVisibility()
  updateStatusVisibility()
}

export const unfollow = (uid: string) => {
  const {user} = store.getState() as StoreState
  if (user && user.uid !== uid) {
    firestore().collection('users').doc(user.uid).collection('following').doc(uid).delete()
  }
  updateLocationVisibility()
  updateStatusVisibility()
}

const getArrayOfFriends = () => {
  const {user} = store.getState() as StoreState
  if (user) {
    return firestore()
      .collection('users')
      .doc(user.uid)
      .collection('following')
      .get()
      .then((col) => {
        if (!col) {
          return []
        }
        return col.docs.map((doc) => doc.id)
      })
  }
  return []
}

export const setStatusOnline = async (expiry?: FirebaseFirestoreTypes.Timestamp) => {
  const {user, statusVisibility} = store.getState() as StoreState
  if (user) {
    let visibility: string[] = []
    if (statusVisibility === 'friends') {
      visibility = await getArrayOfFriends()
    } else if (statusVisibility === 'public') {
      visibility = ['public']
    }
    firestore().collection('statuses').doc(user.uid).set({
      online: true,
      went_online: firestore.FieldValue.serverTimestamp(),
      expiry: expiry,
      visibility: visibility,
    })
  }
}

export const setStatusOffline = () => {
  const {user} = store.getState() as StoreState
  if (user) {
    firestore().collection('statuses').doc(user.uid).delete()
  }
}

export const updateName = (name: string) => {
  const {user} = store.getState() as StoreState
  if (user) {
    firestore().collection('users').doc(user.uid).update({name: name})
  }
}

export const getUserForUID = async (uid: string) => {
  const u = await firestore()
    .collection('users')
    .doc(uid)
    .get()
    .catch((e: Error) => {
      console.log('getUserForUID, user data:', e)
    })
  const s = await firestore()
    .collection('statuses')
    .doc(uid)
    .get()
    .catch((e: Error) => {
      console.log('getUserForUID, status data:', e) // in case status is restricted by visibility rules
    })
  const l = await firestore()
    .collection('locations')
    .doc(uid)
    .get()
    .catch((e: Error) => {
      console.log('getUserForUID, location data:', e) // in case location is restricted by visibility rules
    })
  if (!u) return null
  let user = u.data() as RenderedUser
  user.status = (s?.data() as Status) || undefined
  user.location = (l?.data() as Location) || undefined
  return user
}

export const getFollowerCount = async (uid: string) => {
  const followerCount = await firestore().collection('users').doc(uid).collection('followers').count().get()
  return followerCount.data().count
}

export const getFollowingCount = async (uid: string) => {
  const followingCount = await firestore().collection('users').doc(uid).collection('following').count().get()
  return followingCount.data().count
}

export const updateStatusVisibility = async () => {
  const {user, status, statusVisibility} = store.getState() as StoreState
  if (user && status) {
    let visibility: string[] = []
    if (statusVisibility === 'friends') {
      visibility = await getArrayOfFriends()
      firestore()
        .collection('statuses')
        .doc(user.uid)
        .update({
          visibility: visibility,
        })
        .catch((e: Error) => {
          console.log('Could not update status visiblity on server to friends because of error:', e)
        })
    } else if (statusVisibility === 'public') {
      firestore()
        .collection('statuses')
        .doc(user.uid)
        .update({
          visibility: ['public'],
        })
        .catch((e: Error) => {
          console.log('Could not update status visiblity on server to public because of error:', e)
        })
    }
  }
}

export const updateLocationVisibility = async () => {
  const {user, location, locationVisibility} = store.getState() as StoreState
  if (user && location) {
    let visibility: string[] = []
    if (locationVisibility === 'friends') {
      visibility = await getArrayOfFriends()
      firestore().collection('locations').doc(user.uid).update({
        visibility: visibility,
      })
    } else if (locationVisibility === 'public') {
      firestore()
        .collection('locations')
        .doc(user.uid)
        .update({
          visibility: ['public'],
        })
    }
  }
}
