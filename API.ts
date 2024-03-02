import firestore from '@react-native-firebase/firestore'
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import {store, StoreState} from './Store'

export const publishLocation = (location: {city: string; region: string; country: string; visibility?: string}) => {
  const {user} = store.getState() as StoreState
  if (user) {
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

export const removeLocation = () => {
  const {user} = store.getState() as StoreState
  if (user) {
    firestore().collection('locations').doc(user.uid).delete()
  }
}

export const follow = (uid: string) => {
  const {user} = store.getState() as StoreState
  if (user) {
    firestore().collection('users').doc(user.uid).collection('following').doc(uid).set({})
  }
}

export const unfollow = (uid: string) => {
  const {user} = store.getState() as StoreState
  if (user) {
    firestore().collection('users').doc(user.uid).collection('following').doc(uid).delete()
  }
}

export const setStatusOnline = (expiry?: FirebaseFirestoreTypes.Timestamp, visibility?: string) => {
  const {user} = store.getState() as StoreState
  if (user) {
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
