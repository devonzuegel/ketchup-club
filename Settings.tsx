import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {fonts, Text, styles, NavBtns, Header, GlobalContext, formatPhone, themes} from './Utils'
import {useFonts} from 'expo-font'
import {registerForPushNotificationsAsync} from './push'
import AsyncStorage, {AUTH_TOKEN, PHONE, THEME, PUSH_TOKEN} from './AsyncStorage'
import api from './API'
import {enableLocation} from './Location'
import {useStore, StoreState} from './Store'

type GlobalContextType = {
  phone: string
  setPhone: (phone: string) => void
  // WHAT IS THE FRIENDS TYPE?
  friends: any[]
  setAuthToken: (authToken: string) => void
  authToken: string
  pushToken: string
  setPushToken: (pushToken: string) => void
}

const SettingItem = ({
  name,
  icon,
  value,
  dangerous,
  onPress,
}: {
  name: string
  icon: string
  value: string
  dangerous: boolean
  onPress: () => any
}) => {
  const theme = useStore((state: StoreState) => state.theme)
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
          backgroundColor: themes[theme as 'light' | 'dark'].text_input_bkgd,
          borderRadius: 8,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'SFCompactRounded_Medium',
            lineHeight: 48, // Emojis have a different lineHeight than text, so this is to normalize between the two
            color: dangerous ? 'red' : themes[theme as 'light' | 'dark'].text_secondary,
          }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'SFCompactRounded_Medium',
            color: dangerous ? 'red' : themes[theme as 'light' | 'dark'].text_emphasis,
          }}>
          {value || icon || '🚧' || '❌'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export function SettingsScreen({navigation}) {
  const {phone, setPhone, friends, setAuthToken, authToken, pushToken, setPushToken} = React.useContext(
    GlobalContext
  ) as GlobalContextType
  const user = friends ? friends.find(({phone: theirPhone}: {phone: string}) => theirPhone == phone) : null
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const setTheme = useStore((state: StoreState) => state.setTheme) as (theme: 'light' | 'dark') => void
  const locationPermissionGranted = useStore((state: StoreState) => state.locationPermissionGranted)

  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    console.log('logout')
    api
      .post('/ping', null, {
        params: {status: 'offline'},
        headers: {Authorization: `Bearer ${authToken}`},
      })
      .then(() => {
        // TODO: create fn to handle setting both the global state & AsyncStorage at the same time so we don't have to always remember to do both
        setAuthToken('')
        setPhone('')
        setPushToken('')
        AsyncStorage.removeItem(AUTH_TOKEN)
        AsyncStorage.removeItem(PHONE)
        AsyncStorage.removeItem(PUSH_TOKEN)
        // not necessary remove the theme, that can stay on the device since it's not sensitive
      })
      .catch((err) => console.error('Error logging out of server:', err))
  }

  const onSetPushNotifications = async () => {
    if (!pushToken) {
      const newPushToken = await registerForPushNotificationsAsync()
      if (newPushToken) {
        setPushToken(newPushToken)
        AsyncStorage.setItem(PUSH_TOKEN, newPushToken)
        await api
          .post('/push', null, {params: {push_token: newPushToken}, headers: {Authorization: `Bearer ${authToken}`}})
          .catch((err) => console.error('Error setting push token:', err))
      } else {
        console.error('Error getting push token from registerForPushNotificationsAsync()')
      }
    } else {
      setPushToken('')
      AsyncStorage.removeItem(PUSH_TOKEN)
      await api
        .post('/push', null, {params: {push_token: null}, headers: {Authorization: `Bearer ${authToken}`}})
        .catch((err) => console.error('Error clearing push token:', err))
    }
  }

  const settings = [
    [
      'System Permissions',
      {
        // Contacts: {value: null}, // TODO: put me back
        'Push notifications': {
          value: pushToken || AsyncStorage.getItem(PUSH_TOKEN) ? 'Enabled ✅' : 'Disabled ❌',
          onPress: onSetPushNotifications,
        },
        Location: {
          value: locationPermissionGranted ? 'Enabled ✅' : 'Disabled ❌',
          onPress: enableLocation,
        },
      },
    ],
    [
      'Profile',
      {
        Username: {value: user?.screen_name ? '@' + user?.screen_name : null},
        Phone: {value: formatPhone(phone)},
        // Avatar: {value: null}, // TODO: put me back
      },
    ],
    [
      'Account',
      {
        Theme: {
          value: theme == 'light' ? 'Light ☀️' : 'Dark 🌙',
          onPress: () => {
            const newTheme = theme == 'light' ? 'dark' : 'light'
            setTheme(newTheme)
            // AsyncStorage.setItem(THEME, newTheme)
          },
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
              <SettingItem name={name} value={value} key={j} onPress={onPress} icon={''} dangerous={false} />
            ))}
          </View>
        ))}
        <SettingItem name={'Sign out'} icon="➡️" value="" dangerous onPress={logout} />
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
