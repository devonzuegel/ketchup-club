import {StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {fonts, Text, Button, Pre} from './Utils'
import React, {useState} from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen, AuthTokenContext, logout} from './Login'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import Map from './Map'

const containerPadding = 16

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'SFCompactRounded_Medium',
    backgroundColor: 'black',
    padding: containerPadding,
    paddingTop: 48,
  },
})

// const LoggedIn = () => {
//   return (
//     <View>
//       <Text>Hello, world!</Text>
//       <Button
//         title="Settings"
//         onPress={() => {
//           // TODO: navigate to Settings screen by upddating the state of the navigator
//         }}
//       />
//     </View>
//   )
// }

const Settings = () => {
  const {authToken, setAuthToken} = React.useContext(AuthTokenContext)
  // const [authToken, setAuthToken] = useState(null)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    console.log('logout')
    setAuthToken(null)
    AsyncStorage.removeItem('authToken')
  }

  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <View>
        <Button title="Logout" onPress={logout} />
        <Text>Hello, world!</Text>
      </View>
    </AuthTokenContext.Provider>
  )
}

export default function App() {
  const [authToken, setAuthToken] = useState(null)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Pre data={{authToken}} />
          {authToken ? <Settings /> : <LoginScreen />}
          {/* <Map /> */}
        </View>
      </TouchableWithoutFeedback>
    </AuthTokenContext.Provider>
  )
}
