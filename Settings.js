import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {fonts, Text, styles, NavBtns, Header, GlobalContext, formatPhone, themes} from './Utils'
import {useFonts} from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerForPushNotificationsAsync } from './push'
import api from './API'

const SettingItem = ({name, icon, value, dangerous, onPress}) => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        onTouchEnd={onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 14,
          paddingRight: 14,
          margin: 4,
          backgroundColor: themes[theme].text_input_bkgd,
          borderRadius: 8,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'SFCompactRounded_Medium',
            lineHeight: 48, // Emojis have a different lineHeight than text, so this is to normalize between the two
            color: dangerous ? 'red' : themes[theme].text_secondary,
          }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'SFCompactRounded_Medium',
            color: dangerous ? 'red' : themes[theme].text_emphasis,
          }}>
          {value || icon || '🚧' || '❌'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export function SettingsScreen({navigation}) {
  const {phone, friends, setAuthToken, authToken, theme, setTheme} = React.useContext(GlobalContext)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null
  const user = friends ? friends.find(({phone: theirPhone}) => theirPhone == phone) : null

  const logout = () => {
    console.log('logout')
    setAuthToken(null)
    setPhone(null)
    AsyncStorage.removeItem('authToken')
    AsyncStorage.removeItem('phone')
  }

  const onSetPushNotifications = async () => {
    const push_token = await registerForPushNotificationsAsync();
    if (push_token) {
      const r = await api.post("/push", null, {
        params: {push_token},
        headers: {"Authorization": `Bearer ${authToken}`}
      })
    }
  }

  const settings = [
    [
      'System Permissions',
      {
        Contacts: {value: null},
        'Push Notifications': {
          value: null, 
          onPress: onSetPushNotifications,
        },
      },
    ],
    [
      'Profile',
      {
        Username: {value: user?.screen_name ? '@' + user?.screen_name : null},
        Phone: {value: formatPhone(phone)},
        Avatar: {value: null},
      },
    ],
    [
      'Account',
      {
        Theme: {
          value: theme == 'light' ? 'Light ☀️' : 'Dark 🌙',
          onPress: () => setTheme(theme == 'light' ? 'dark' : 'light'),
        },
      },
    ],
  ]

  return (
    <View style={{...styles(theme).container, ...styles(theme).flexColumn}}>
      <View style={{marginTop: 48}}>
        <Header style={{fontSize: 28, color: themes[theme].text_secondary}}>Settings</Header>

        {settings.map(([section, sectionItems], i) => (
          <View key={i}>
            <Header style={{textAlign: 'left', fontSize: 16, marginLeft: 16, marginBottom: 2, marginTop: 32}}>{section}</Header>
            {Object.entries(sectionItems).map(([name, {value, onPress}], j) => (
              <SettingItem name={name} value={value} key={j} onPress={onPress} />
            ))}
          </View>
        ))}
        <SettingItem name={'Sign out'} icon="➡️" dangerous onPress={logout} />
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
