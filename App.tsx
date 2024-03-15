import {useFonts} from 'expo-font'
import React from 'react'
import {LoginScreen} from './LoginScreen'
import {fonts} from './Utils'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import * as loadFirestore from './Firestore'
import messaging from '@react-native-firebase/messaging'
import {LoadingScreen} from './LoadingScreen'
import {registerFCMToken, handleBackgroundNotification, handleForegroundNotification} from './Push'
import {LoggedInNavigator} from './components/LoggedInNavigator'

export const debug = false

console.log('=================================================================')
console.log('STARTING APP...')
console.log('          mode: ' + (__DEV__ ? 'DEVELOPMENT  🛠️' : 'PRODUCTION 🚀'))
// console.log('  API base URL:', apiBaseURL)
console.log('=================================================================')

messaging().setBackgroundMessageHandler(handleBackgroundNotification)

export default function App() {
  const [initializing, setInitializing] = React.useState(true)
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null)
  const [fontsLoaded] = useFonts(fonts)
  const fs = loadFirestore.fs

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user)
    console.log('🔒 user:', user?.phoneNumber || 'null')
    if (initializing) setInitializing(false)
  }

  React.useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)
    const foregroundMessageSubscriber = messaging().onMessage(handleForegroundNotification)
    // registerFCMToken()

    return () => {
      authSubscriber()
      foregroundMessageSubscriber()
    }
  }, [])

  if (initializing || !fontsLoaded || !fs) {
    return <LoadingScreen />
  }

  return user ? <LoggedInNavigator /> : <LoginScreen />
}
