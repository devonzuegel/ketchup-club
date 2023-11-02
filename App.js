import {StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {fonts} from './Utils'
import React from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen} from './Login'
import Map from './Map'

const containerPadding = 16

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'SFCompactRounded_Medium',
    backgroundColor: 'black',
    padding: containerPadding,
  },
})

export default function App() {
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LoginScreen />
        {/* <Map /> */}
      </View>
    </TouchableWithoutFeedback>
  )
}
