import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging'
import {Alert} from 'react-native'
import {store, StoreState} from './Store'

export const registerFCMToken = async () => {
  const notificationsEnabled = store.getState().notificationsEnabled as boolean
  console.log('notifications enabled:', notificationsEnabled)
  const token = await messaging() // registration may not be happening because we don't have an APN key set up
    .getToken()
    .catch((e) => console.log('Failed to get FCM token:', e))
  if (token) {
    console.log('Device is registered with FCM.')
    console.log('🔒 token:', token)
  } else {
    console.log('Failed to get FCM token. Device might not be registered.')
  }
}

const requestUserPermission = async () => {
  const {setNotificationPermissionGranted, setNotificationsEnabled} = store.getState() as StoreState
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    setNotificationPermissionGranted(true)
    setNotificationsEnabled(true)
    console.log('Notification authorization status:', authStatus)
  } else if (!enabled) {
    setNotificationPermissionGranted(false)
    setNotificationsEnabled(false)
  }
}

export const handleForegroundNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
}

export const handleBackgroundNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('Message handled in the background!', remoteMessage)
}

export const disableNotifications = async () => {
  const {setNotificationsEnabled} = store.getState() as StoreState
  setNotificationsEnabled(false)
}

export const enableNotifications = async () => {
  const authStatus = await messaging().hasPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
  if (!enabled) {
    requestUserPermission()
  } else {
    const {setNotificationPermissionGranted, setNotificationsEnabled} = store.getState() as StoreState
    setNotificationsEnabled(true)
    setNotificationPermissionGranted(true)
  }
}

const checkForNotificationPermission = async () => {
  const {setNotificationPermissionGranted, setNotificationsEnabled} = store.getState() as StoreState
  const authStatus = await messaging().hasPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    setNotificationPermissionGranted(true)
  } else {
    setNotificationPermissionGranted(false)
    setNotificationsEnabled(false)
  }
}

// import {useEffect, useRef, useState} from 'react'
// import {Platform} from 'react-native'

// import * as Device from 'expo-device'
// import * as Notifications from 'expo-notifications'
// // import { useRouter } from "expo-router";

// // These code is mostly taken from:
// // https://levelup.gitconnected.com/push-notifications-with-react-native-expo-and-node-js-30aa824c7956

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// })

// // TODO: move to environment variable
// // const EXPO_PUBLIC_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;
// const EXPO_PUBLIC_PROJECT_ID = 'b4a2f0d3-ce87-4538-baf1-3db1eabce9b7'

// console.log('EXPO_PUBLIC_PROJECT_ID', EXPO_PUBLIC_PROJECT_ID)

// export async function registerForPushNotificationsAsync() {
//   if (Device.isDevice && Platform.OS !== 'web') {
//     const {status: existingStatus} = await Notifications.getPermissionsAsync()
//     let finalStatus = existingStatus

//     if (existingStatus !== 'granted') {
//       const {status} = await Notifications.requestPermissionsAsync()
//       finalStatus = status
//       console.log('existingStatus', existingStatus)
//     }

//     // if (finalStatus !== 'granted') {
//     //   alert('Failed to get push token for push notification! — final status: ' + finalStatus)
//     //   console.log('finalStatus', finalStatus)
//     //   // return
//     // }

//     const token = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId: EXPO_PUBLIC_PROJECT_ID,
//       })
//     ).data

//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         showBadge: true,
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FE9018',
//       })
//     }

//     // The token should be sent to the server
//     // so that it can be used to send push notifications to the device
//     return token
//   }
// }

// // currently un-used: Commenting out since it is giving us some type errors
// // export const usePushNotificationRouter = () => {
// //   const notificationListener = useRef()
// //   const responseListener = useRef()
// //   const [expoPushToken, setExpoPushToken] = useState('')

// //   //   const router = useRouter();

// //   useEffect(() => {
// //     // This listener is fired whenever a notification is received while the app is foregrounded
// //     notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
// //       console.log('notification', notification)
// //     })

// //     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
// //     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
// //       console.log('incoming notification', response)
// //       const {
// //         notification: {
// //           request: {
// //             content: {
// //               data: {url},
// //             },
// //           },
// //         },
// //       } = response

// //       if (url) {
// //         console.log('should navigate to', url)
// //         //   router.push(url);
// //       }
// //     })

// //     return () => {
// //       Notifications.removeNotificationSubscription(notificationListener.current)
// //       Notifications.removeNotificationSubscription(responseListener.current)
// //     }
// //   }, [])

// //   return [expoPushToken, setExpoPushToken]
// // }
