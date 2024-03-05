import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {View, Text} from 'react-native'
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useFonts} from 'expo-font'
import React from 'react'
import {FriendsScreen} from './FriendsScreen'
import HomeScreen from './HomeScreen'
import {LoginScreen} from './LoginScreen'
import {SettingsScreen} from './SettingsScreen'
import {ProfileScreen} from './ProfileScreen'
import {GlobalContext, Pre, fonts} from './Utils'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import * as loadFirestore from './Firestore'
import {Alert} from 'react-native'
import messaging from '@react-native-firebase/messaging'
import {LoadingScreen} from './LoadingScreen'
import {handleBackgroundNotification, handleForegroundNotification} from './Push'

export const debug = false

console.log('=================================================================')
console.log('STARTING APP...')
console.log('          mode: ' + (__DEV__ ? 'DEVELOPMENT  🛠️' : 'PRODUCTION 🚀'))
// console.log('  API base URL:', apiBaseURL)
console.log('=================================================================')

export type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Friends: undefined
  Profile: {uid: string}
}

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>
export type FriendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Friends'>
// type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>
// type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>
export type ProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'Profile'>
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>
}

export const Stack = createNativeStackNavigator()

const LoggedInNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" screenOptions={{animation: 'none'}}>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} initialParams={{itemId: 10}} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Friends" component={FriendsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: true}} />
    </Stack.Navigator>
  </NavigationContainer>
)

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  handleBackgroundNotification(remoteMessage)
})

export default function App() {
  const [initializing, setInitializing] = React.useState(true)
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null)
  const [fontsLoaded] = useFonts(fonts)
  const globalContextVars = {}
  const fs = loadFirestore.fs

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user)
    console.log('🔒 user:', user?.phoneNumber || 'null')
    if (initializing) setInitializing(false)
  }

  React.useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)
    const foregroundMessageSubscriber = messaging().onMessage(async (remoteMessage) => {
      handleForegroundNotification(remoteMessage)
    })

    return () => {
      authSubscriber()
      foregroundMessageSubscriber()
    }
  }, [])

  if (initializing || !fontsLoaded || !fs) {
    return LoadingScreen
  }

  return (
    <GlobalContext.Provider value={globalContextVars}>
      {user ? <LoggedInNavigator /> : <LoginScreen />}
      {debug && <Pre data={{}} children={null} />}
    </GlobalContext.Provider>
  )
}
