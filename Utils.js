import React, {useState, useEffect} from 'react'
import {View, Button as RNButton, StyleSheet, TouchableOpacity, Text as RNText} from 'react-native'
import {PhoneNumberUtil, PhoneNumberFormat} from 'google-libphonenumber'

export const GlobalContext = React.createContext()

export const NavBtns = ({navigation}) => {
  const getCurrentScreen = () => {
    const {routes, index} = navigation.getState()
    return routes[index].name
  }
  const isCurrentScreen = (screenName) => screenName == getCurrentScreen()
  return (
    <View>
      <View flexDirection="row" justifyContent="space-around" style={{marginBottom: 40}}>
        <Button
          title="Friends"
          btnStyle={isCurrentScreen('Friends') && {borderColor: 'white'}}
          textStyle={isCurrentScreen('Friends') && {color: 'white'}}
          onPress={() => navigation.navigate('Friends')}
        />
        <Button
          title="Home"
          btnStyle={isCurrentScreen('Home') && {borderColor: 'white'}}
          textStyle={isCurrentScreen('Home') && {color: 'white'}}
          onPress={() => navigation.push('Home', {itemId: Math.floor(Math.random() * 100)})}
        />
        <Button
          title="Settings"
          btnStyle={isCurrentScreen('Settings') && {borderColor: 'white'}}
          textStyle={isCurrentScreen('Settings') && {color: 'white'}}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>
  )
}
TouchableOpacity.defaultProps = {activeOpacity: 0.8}

const containerPadding = 16

export const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    fontFamily: 'SFCompactRounded_Medium',
    backgroundColor: 'black',
    padding: containerPadding,
    paddingTop: 48,
    // borderColor: '#222',
    // borderWidth: 2,
    // borderStyle: 'dotted',
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column', // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: 'space-between', // will create the gutter between body and footer
  },
})

export const debugStyles = StyleSheet.create({
  message: {
    padding: 12,
    marginTop: 24,
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 4,
    justifyContent: 'left',
    width: 300,
    marginBottom: 12,
  },
  msgTxt: {color: 'white', fontFamily: 'Courier New'},
})

export const Header = ({children, style}) => (
  <Text style={{textAlign: 'center', fontSize: 20, color: '#444', marginBottom: 4, ...style}}>{children}</Text>
)

export const Text = (props) => (
  <RNText {...props} style={{fontFamily: 'SFCompactRounded_Medium', color: 'white', ...props.style}}>
    {props.children}
  </RNText>
)

export const Button = ({onPress, title, btnStyle, textStyle}) => (
  <TouchableOpacity onPress={onPress} style={{...styles.appButtonContainer, ...btnStyle}}>
    <Text style={{...styles.appButtonText, ...textStyle}}>{title}</Text>
  </TouchableOpacity>
)

export const Pre = ({data, children}) => (
  <Text style={{fontFamily: 'Courier New', marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: '#222'}}>
    {children || JSON.stringify(data, null, 2)}
  </Text>
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
  console.log({fullPhoneNumber})
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
