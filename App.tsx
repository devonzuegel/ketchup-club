import {NavigationContainer} from '@react-navigation/native'
import {View, Text} from 'react-native'
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useFonts} from 'expo-font'
import React from 'react'
import {FriendsScreen} from './Friends'
import HomeScreen from './Home'
import {LoginScreen} from './Login'
import {SettingsScreen} from './Settings'
import {GlobalContext, Pre, fonts} from './Utils'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import * as loadFirestore from './Firestore'

export const debug = false

console.log('=================================================================')
console.log('STARTING APP...')
console.log('          mode: ' + (__DEV__ ? 'DEVELOPMENT  🛠️' : 'PRODUCTION 🚀'))
// console.log('  API base URL:', apiBaseURL)
console.log('=================================================================')

type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Friends: undefined
}

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>
export type FriendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Friends'>

const Stack = createNativeStackNavigator()

const LoggedInNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" screenOptions={{animation: 'none'}}>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} initialParams={{itemId: 10}} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Friends" component={FriendsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
)

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
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  if (initializing || !fontsLoaded || !fs) {
    return (
      <View style={{}}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <GlobalContext.Provider value={globalContextVars}>
      {user ? <LoggedInNavigator /> : <LoginScreen />}
      {debug && <Pre data={{}} children={null} />}
    </GlobalContext.Provider>
  )
}
