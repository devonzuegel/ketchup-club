import {StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {fonts, Text, Button} from './Utils'
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

export default function App() {
  const [authToken, setAuthToken] = useState(null)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    setAuthToken(null)
    AsyncStorage.removeItem('authToken')
  }
  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {authToken ? <Button title="Logout" onPress={logout} /> : <LoginScreen />}
          {/* <Map /> */}
        </View>
      </TouchableWithoutFeedback>
    </AuthTokenContext.Provider>
  )
}
