import {StyleSheet, View} from 'react-native'
import {fonts, Text, Button} from './Utils'
import React, {useState} from 'react'
import {useFonts} from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthTokenContext = React.createContext() // allows access to the auth token throughout the app

export const LoggedIn = () => {
  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <View>
        <Text>Hello, world!</Text>
        <Button
          title="Settings"
          onPress={() => {
            // TODO: navigate to Settings screen by upddating the state of the navigator
          }}
        />
      </View>
    </AuthTokenContext.Provider>
  )
}

const Settings = () => {
  const {setAuthToken} = React.useContext(AuthTokenContext)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    setAuthToken(null)
    AsyncStorage.removeItem('authToken')
  }
  return (
    <View>
      <Button title="Logout" onPress={logout} />
      <Text>Hello, world!</Text>
    </View>
  )
}
