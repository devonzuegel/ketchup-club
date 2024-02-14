import {GlobalContext, fonts, Pre, View, Text} from './Utils'
import React from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen} from './Login'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from './Home'
import AsyncStorage, {AUTH_TOKEN, PHONE, THEME, PUSH_TOKEN} from './AsyncStorage'
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
  const [pushToken, setPushToken] = React.useState(null)
  const globalContextVars = {
    authToken,
    setAuthToken,
    friends,
    setFriends,
    phone,
    setPhone,
    theme,
    setTheme,
    status,
    setStatus,
    pushToken,
    setPushToken,
  }

  React.useEffect(() => {
    async function fetchFromLocalStorage() {
      const authToken = await AsyncStorage.getItem(AUTH_TOKEN)
      const phone = await AsyncStorage.getItem(PHONE)
      const theme = await AsyncStorage.getItem(THEME)
      const pushToken = await AsyncStorage.getItem(PUSH_TOKEN)
      console.log('🗄️ authToken from async storage: ', authToken || 'null')
      console.log('🗄️     phone from async storage: ', phone || 'null')
      console.log('🗄️     theme from async storage: ', theme || 'null')
      console.log('🗄️ pushToken from async storage: ', pushToken || 'null')

      // WARNING: storing in the component state AND in AsyncStorage may cause confusion in the future...
      //          ... but it's the best solution we have for now, so let's stick with it
      if (authToken) setAuthToken(authToken)
      if (phone) setPhone(phone)
      if (theme) setTheme(theme)
      if (pushToken) setPushToken(pushToken)
    }
    fetchFromLocalStorage()
  }, [])

  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  return (
    <GlobalContext.Provider value={globalContextVars}>
      {authToken ? <LoggedInNavigator /> : <LoginScreen />}
      {debug && <Pre data={{...globalContextVars, friends: friends && friends.length}} />}
    </GlobalContext.Provider>
  )
}
