import React from 'react'
import {View, Button as RNButton, StyleSheet, TouchableOpacity, Text} from 'react-native'

TouchableOpacity.defaultProps = {activeOpacity: 0.8}

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        marginTop: 4,
        marginBottom: 4,
        borderColor: '#007aff',
        borderWidth: 1,
      },
    }),
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'SFCompactRounded_Medium',
    fontWeight: 'bold',
    alignSelf: 'center',
    // textTransform: 'uppercase',
    ...Platform.select({
      ios: {
        color: '#007aff',
      },
    }),
  },
})

export const Button = ({onPress, title, style}) => (
  <TouchableOpacity onPress={onPress} style={{...styles.appButtonContainer, ...style}}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
)

export const fonts = {
  SFCompactRounded_Thin: require('./assets/fonts/SF-Compact-Rounded-Thin.otf'),
  SFCompactRounded_Light: require('./assets/fonts/SF-Compact-Rounded-Light.otf'),
  SFCompactRounded_Regular: require('./assets/fonts/SF-Compact-Rounded-Regular.otf'),
  SFCompactRounded_Medium: require('./assets/fonts/SF-Compact-Rounded-Medium.otf'),
  SFCompactRounded_Semibold: require('./assets/fonts/SF-Compact-Rounded-Semibold.otf'),
  SFCompactRounded_Bold: require('./assets/fonts/SF-Compact-Rounded-Bold.otf'),
  SFCompactRounded_Heavy: require('./assets/fonts/SF-Compact-Rounded-Heavy.otf'),
  SFCompactRounded_Black: require('./assets/fonts/SF-Compact-Rounded-Black.otf'),
}
