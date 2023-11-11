import {StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {fonts, Text, Button, Pre} from './Utils'
import React, {useState} from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen, AuthTokenContext, logout} from './Login'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

// import Map from './Map'

const containerPadding = 16

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'SFCompactRounded_Medium',
    backgroundColor: 'black',
    padding: containerPadding,
    paddingTop: 48,
    borderColor: '#222',
    borderStyle: 'dotted',
    borderWidth: 2,
  },
})

const NavBtns = ({navigation}) => (
  <View>
    <View flexDirection="row" justifyContent="space-around">
      <Button title="<" onPress={() => navigation.goBack()} />
      <Button title="Friends" onPress={() => navigation.navigate('Friends')} />
      <Button title="Home" onPress={() => navigation.push('Home', {itemId: Math.floor(Math.random() * 100)})} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  </View>
)
// const SettingsScreen = () => {
//   const {authToken, setAuthToken} = React.useContext(AuthTokenContext)
//   // const [authToken, setAuthToken] = useState(null)
//   const [fontsLoaded] = useFonts(fonts)
//   if (!fontsLoaded) return null

//   const logout = () => {
//     console.log('logout')
//     setAuthToken(null)
//     AsyncStorage.removeItem('authToken')
//   }

//   return (
//     <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
//       <View>
//         <Button title="Logout" onPress={logout} />
//         <Text>Hello, world!</Text>
//       </View>
//     </AuthTokenContext.Provider>
//   )
// }

function SettingsScreen({navigation}) {
  return (
    <View style={styles.container}>
      <NavBtns navigation={navigation} />
      <Text>Settings</Text>
    </View>
  )
}

function HomeScreen({route, navigation}) {
  /* 2. Get the param */
  const {itemId, otherParam} = route.params
  return (
    <View style={styles.container}>
      <NavBtns navigation={navigation} />
      <Text>Home Screen</Text>
      <Pre data={route.params} />
    </View>
  )
}

function FriendsScreen({navigation}) {
  return (
    <View style={styles.container}>
      <NavBtns navigation={navigation} />
      <Text>Friends</Text>
    </View>
  )
}

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
  const [authToken, setAuthToken] = useState(null)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Pre data={{authToken}} />
          <LoggedInNavigator />
          {/* {authToken ? <LoggedInNavigator /> : <LoginScreen />} */}
          {/* <Map /> */}
        </View>
      </TouchableWithoutFeedback>
    </AuthTokenContext.Provider>
  )
}
