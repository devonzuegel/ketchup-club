import React, {useState, useEffect, forwardRef} from 'react'
import {View, StyleSheet, TouchableOpacity, Text as RNText, TextInput as RNTextInput} from 'react-native'
import {PhoneNumberUtil, PhoneNumberFormat} from 'google-libphonenumber'
import AsyncStorage from './AsyncStorage'

export const GlobalContext = React.createContext()

const containerPadding = 16

const colors = {
  black_0: '#000',
  black_1: '#50606C',
  black_2: '#6E7C87',
  black_3: '#AAB7C0',
  grey_0: '#bbb',
  grey_1: '#ccc',
  grey_2: '#ddd',
  grey_4: 'rgba(0, 0, 0, 0.05)',
  grey_5: 'rgba(255, 255, 255, 0.2)',
  white_0: '#fff',
  white_1: '#ddd',
  white_2: '#bbb',
  white_3: '#999',
  white_4: '#777',
  white_5: '#555',
}

export const themes = {
  light: {
    backgroundColor: colors.white_0,
    text_emphasis: colors.black_0,
    text_primary: colors.black_1,
    text_secondary: colors.black_2,
    text_tertiary: colors.black_3,
    text_input_placeholder: colors.grey_0,
    text_input_bkgd: colors.grey_4,
  },
  dark: {
    backgroundColor: colors.black_0,
    text_emphasis: colors.white_0,
    text_primary: colors.white_1,
    text_secondary: colors.white_2,
    text_tertiary: colors.white_3,
    text_input_placeholder: colors.white_5,
    text_input_bkgd: colors.grey_5,
  },
}

const navBtnTextColor = (name_of_screen, current_screen, theme) =>
  name_of_screen == current_screen ? themes[theme].text_emphasis : themes[theme].text_input_placeholder

const navBtnBorderColor = (name_of_screen, current_screen, theme) =>
  name_of_screen == current_screen ? themes[theme].text_emphasis : themes[theme].text_input_placeholder

export const NavBtns = ({navigation}) => {
  const {theme} = React.useContext(GlobalContext)

  const getCurrentScreen = () => {
    const {routes, index} = navigation.getState()
    return routes[index].name
  }
  const current_screen = getCurrentScreen()

  return (
    <View>
      {/* <Pre data={AsyncStorage.getAllKeys()} /> */}

      {/* clear every key set in AsyncStorage: */}
      {/* <Button title="reset AsyncStorage" onPress={() => AsyncStorage.clear()} /> */}

      <View flexDirection="row" justifyContent="space-around" style={{marginBottom: 40}}>
        <Button
          title="Friends"
          btnStyle={{borderColor: navBtnBorderColor('Friends', current_screen, theme)}}
          textStyle={{fontSize: 16, color: navBtnTextColor('Friends', current_screen, theme)}}
          onPress={() => navigation.navigate('Friends')}
        />
        <Button
          title="Home"
          btnStyle={{borderColor: navBtnBorderColor('Home', current_screen, theme)}}
          textStyle={{fontSize: 16, color: navBtnTextColor('Home', current_screen, theme)}}
          onPress={() => navigation.push('Home', {itemId: Math.floor(Math.random() * 100)})}
        />
        <Button
          title="Settings"
          btnStyle={{borderColor: navBtnBorderColor('Settings', current_screen, theme)}}
          textStyle={{fontSize: 16, color: navBtnTextColor('Settings', current_screen, theme)}}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>
  )
}
TouchableOpacity.defaultProps = {activeOpacity: 0.8}

// Throw an error if themes.light and themes.dark don't have the same keys
if (Object.keys(themes.light).sort().join(',') != Object.keys(themes.dark).sort().join(','))
  throw new Error('themes.light and themes.dark must have the same keys')

export const styles = (theme) =>
  StyleSheet.create({
    appButtonContainer: {
      elevation: 8,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginTop: 10,
      marginBottom: 10,
      borderColor: '#007aff',
      borderWidth: 1,
      borderColor: themes.light.text_secondary,
      borderWidth: 2,
    },
    appButtonText: {
      fontSize: 18,
      color: themes.light.text_secondary,
      fontFamily: 'SFCompactRounded_Medium',
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    container: {
      flex: 1,
      fontFamily: 'SFCompactRounded_Medium',
      backgroundColor: themes[theme].backgroundColor,
      padding: containerPadding,
      paddingBottom: 0,
      paddingTop: 48,
    },
    flexColumn: {
      flex: 1,
      flexDirection: 'column', // inner items will be added vertically
      flexGrow: 1, // all the available vertical space will be occupied by it
      justifyContent: 'space-between', // will create the gutter between body and footer
    },
    textInput: {
      height: 40,
      marginTop: 4,
      marginBottom: 4,
      padding: 10,
      color: themes[theme].text_primary,
      fontFamily: 'SFCompactRounded_Medium',
      borderRadius: 10,
      fontSize: 15,
      backgroundColor: themes[theme].text_input_bkgd,
    },
  })

export const debugStyles = (theme) =>
  StyleSheet.create({
    message: {
      padding: 12,
      marginTop: 24,
      backgroundColor: '#222',
      color: themes[theme].text_secondary,
      borderRadius: 4,
      justifyContent: 'left',
      width: 300,
      marginBottom: 12,
    },
    msgTxt: {
      color: themes[theme].text_secondary,
      fontFamily: 'Courier New',
    },
  })

export const Header = ({children, style}) => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 24,
        color: themes[theme].text_tertiary,
        marginBottom: 4,
        fontFamily: 'SFCompactRounded_Semibold',
        ...style,
      }}>
      {children}
    </Text>
  )
}

export const Text = (props) => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <RNText {...props} style={{fontFamily: 'SFCompactRounded_Medium', color: themes[theme].text_primary, ...props.style}}>
      {props.children}
    </RNText>
  )
}

export const TextInput = forwardRef((props, ref) => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor={themes[theme].text_input_placeholder}
      {...props}
      style={{...styles(theme).textInput, ...props.style}}
    />
  )
})

export const Button = ({onPress, title, btnStyle, textStyle}) => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles(theme).appButtonContainer,
        ...btnStyle,
      }}>
      <Text style={{...styles.appButtonText, ...textStyle}}>{title}</Text>
    </TouchableOpacity>
  )
}

export const Pre = ({data, children}) => (
  <Text style={{fontFamily: 'Courier New', marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: '#222'}}>
    {children || JSON.stringify(data, null, 2)}
  </Text>
)

export const Spacer = () => <View style={{marginTop: 48}} />

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

export const DotAnimation = ({style}) => {
  const [dots, setDots] = useState('...')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + '.'
        } else {
          return ''
        }
      })
    }, 300) // Change dot every 500 milliseconds

    return () => clearInterval(interval)
  }, [])

  return (
    <View>
      <Text style={style}>Loading{dots}</Text>
    </View>
  )
}

// // WARNING: this may not be the correct way to format phone numbers for all international phone numbers. I checked it for
// // the US and Argentina, and it seems to work. But I'm not sure if it will work for all countries.
// export const formatPhone = (phone) => {
//   if (!phone) return null

//   phone = phone.replace(/[^\d]/g, '') // normalize string & remove all unnecessary characters

//   if (phone.length == 10) return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
//   if (phone.length == 11) return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
//   if (phone.length == 12) return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
//   if (phone.length == 13) return phone.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')

//   return phone
// }

export const removeCountryCode = (fullPhoneNumber) => {
  if (fullPhoneNumber == null) return null
  try {
    const phoneUtil = PhoneNumberUtil.getInstance()
    const parsedPhone = phoneUtil.parse(fullPhoneNumber)
    const domesticNumber = phoneUtil.getNationalSignificantNumber(parsedPhone)
    const countryCode = phoneUtil.getCountryCodeForRegion(phoneUtil.getRegionCodeForNumber(parsedPhone))
    if (debug) console.log({fullPhoneNumber, domesticNumber, countryCode})
    return domesticNumber
  } catch (error) {
    return null
  }
}

export const countryCode = (fullPhoneNumber) => {
  if (fullPhoneNumber == null) return null
  try {
    const phoneUtil = PhoneNumberUtil.getInstance()
    const parsedPhone = phoneUtil.parse(fullPhoneNumber)
    const countryCodeName = phoneUtil.getRegionCodeForNumber(parsedPhone)
    if (debug) console.log({fullPhoneNumber, countryCodeName})
    return countryCodeName
  } catch (error) {
    return null
  }
}

export const formatPhone = (phoneNumberString) => {
  if (!phoneNumberString) return null
  try {
    const phoneUtil = PhoneNumberUtil.getInstance()
    const phoneNumber = phoneUtil.parseAndKeepRawInput(phoneNumberString, countryCode(phoneNumberString))
    return phoneUtil.format(phoneNumber, PhoneNumberFormat.INTERNATIONAL)
  } catch (error) {
    console.error('Error formatting phone number:', error.message)
    return phoneNumberString
  }
}
