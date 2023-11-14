import React from 'react'
import {View, Button as RNButton, StyleSheet, TouchableOpacity, Text as RNText} from 'react-native'

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
    {children || JSON.stringify({data}, null, 2)}
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
