import React from 'react'
import {View} from 'react-native'
import {fonts, Text, styles, NavBtns, Header, GlobalContext, formatPhone} from './Utils'
import {useFonts} from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SettingItem = ({name, icon, value, dangerous, onPress}) => (
  <View
    onTouchEnd={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 14,
      paddingRight: 14,
      margin: 4,
      backgroundColor: '#222',
      borderRadius: 8,
    }}>
    <Text style={{fontSize: 18, fontFamily: 'SFCompactRounded_Regular', color: dangerous ? 'red' : 'white'}}>{name}</Text>
    <Text style={{fontSize: 15, fontFamily: 'SFCompactRounded_Regular', color: dangerous ? 'red' : 'white'}}>
      {value || icon || '❌'}
    </Text>
  </View>
)

export function SettingsScreen({navigation}) {
  const {phone, authToken, setAuthToken} = React.useContext(GlobalContext)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    console.log('logout')
    setAuthToken(null)
    AsyncStorage.removeItem('authToken')
  }

  const settings = [
    ['System Permissions', {Contacts: null, 'Push Notifications': null}],
    ['Profile', {Username: null, Avatar: null, Phone: formatPhone(phone)}],
    ['Account', {}],
  ]

  return (
    <GlobalContext.Provider value={{authToken, setAuthToken}}>
      <View style={{...styles.container, ...styles.flexColumn}}>
        <View style={{marginTop: 48}}>
          <Header>Settings</Header>

          {settings.map(([section, sectionItems], i) => (
            <View key={i}>
              <Header style={{textAlign: 'left', fontSize: 16, marginLeft: 16, marginBottom: 2, marginTop: 18}}>{section}</Header>
              {Object.entries(sectionItems).map(([name, value], j) => (
                <SettingItem name={name} value={value} key={j} />
              ))}
            </View>
          ))}
          <SettingItem name={'Sign out'} icon="➡️" dangerous onPress={logout} />
        </View>

        <NavBtns navigation={navigation} />
      </View>
    </GlobalContext.Provider>
  )
}
