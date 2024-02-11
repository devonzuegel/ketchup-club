import {GlobalContext, fonts, Pre, View, Text} from './Utils'
import React from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen} from './Login'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from './Home'
import {FriendsScreen} from './Friends'
import {SettingsScreen} from './Settings'
import {apiBaseURL} from './API'
import {checkLocationPermissions} from './Location'

export const debug = false

console.log('=================================================================')
console.log('STARTING APP...')
console.log('          mode: ' + (__DEV__ ? 'DEVELOPMENT  🛠️' : 'PRODUCTION 🚀'))
console.log('  API base URL:', apiBaseURL)
console.log('=================================================================')

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
  const [authToken, setAuthToken] = React.useState(null)
  const [friends, setFriends] = React.useState(null)
  const [phone, setPhone] = React.useState(null)
  const [theme, setTheme] = React.useState('light')
  const [status, setStatus] = React.useState('offline')
  const globalContextVars = {authToken, setAuthToken, friends, setFriends, phone, setPhone, theme, setTheme, status, setStatus}

  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  checkLocationPermissions()

  return (
    <GlobalContext.Provider value={globalContextVars}>
      {authToken ? <LoggedInNavigator /> : <LoginScreen />}
      {debug && <Pre data={{...globalContextVars, friends: friends && friends.length}} />}
    </GlobalContext.Provider>
  )
}
