import React from 'react'
import {View, Button as RNButton, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'

TouchableOpacity.defaultProps = {activeOpacity: 0.8}

const styles = StyleSheet.create({
  appButtonText: {},
})

export const Button = ({onPress, title}) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient colors={['#004d40', '#009688']} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
)
