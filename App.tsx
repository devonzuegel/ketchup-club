import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {useFonts} from 'expo-font'
import React from 'react'
import {apiBaseURL} from './API'
import AsyncStorage, {AUTH_TOKEN, PHONE, PUSH_TOKEN} from './AsyncStorage'
import {FriendsScreen} from './Friends'
import HomeScreen from './Home'
import {LoginScreen} from './Login'
import {SettingsScreen} from './Settings'
import {StoreState, useStore} from './Store'
import {GlobalContext, Pre, fonts} from './Utils'

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
  const [authToken, setAuthToken] = React.useState<string>()
  const [friends, setFriends] = React.useState(null)
  const [phone, setPhone] = React.useState<string>()
  const theme = useStore((state: StoreState) => state.theme)
  const [status, setStatus] = React.useState('offline')
  const [pushToken, setPushToken] = React.useState<string>()
  const globalContextVars = {
    authToken,
    setAuthToken,
    friends,
    setFriends,
    phone,
    setPhone,
    status,
    setStatus,
    pushToken,
    setPushToken,
  }

  React.useEffect(() => {
    async function fetchFromLocalStorage() {
      const authToken = await AsyncStorage.getItem(AUTH_TOKEN)
      const phone = await AsyncStorage.getItem(PHONE)
      const pushToken = await AsyncStorage.getItem(PUSH_TOKEN)
      console.log('🗄️ authToken from async storage: ', authToken || 'null')
      console.log('🗄️     phone from async storage: ', phone || 'null')
      console.log('🗄️     theme from Zustand store: ', theme || 'null')
      console.log('🗄️ pushToken from async storage: ', pushToken || 'null')

      // WARNING: storing in the component state AND in AsyncStorage may cause confusion in the future...
      //          ... but it's the best solution we have for now, so let's stick with it
      if (authToken) setAuthToken(authToken)
      if (phone) setPhone(phone)
      if (pushToken) setPushToken(pushToken)
    }
    fetchFromLocalStorage()
  }, [])

  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  return (
    <GlobalContext.Provider value={globalContextVars}>
      {authToken ? <LoggedInNavigator /> : <LoginScreen />}
      {debug && <Pre data={{...globalContextVars, friends: friends && friends.length}} children={null} />}
    </GlobalContext.Provider>
  )
}
