import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {fonts, Text, styles, NavBtns, Header, GlobalContext, formatPhone, themes} from './Utils'
import {useFonts} from 'expo-font'
import {enableLocation} from './Location'
import {useStore, StoreState} from './Store'
import auth from '@react-native-firebase/auth'
import {User} from './Firestore'
import {SettingsScreenNavigationProp} from './App'

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

export function SettingsScreen({navigation}: {navigation: SettingsScreenNavigationProp}) {
  const user = useStore((state: StoreState) => state.user) as User | null

  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const setTheme = useStore((state: StoreState) => state.setTheme) as (theme: 'light' | 'dark') => void
  const locationPermissionGranted = useStore((state: StoreState) => state.locationPermissionGranted)

  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    console.log('logout')
    auth()
      .signOut()
      .then(() => {
        console.log('Signed out successfully')
      })
      .catch((e: Error) => {
        // ignore error, it appears to be a Firebase bug with accounts that are only Phone Auth
      })
  }

  const onSetPushNotifications = async () => {}

  const settings = [
    [
      'System Permissions',
      {
        Contacts: {value: null}, // TODO: put me back
        'Push notifications': {value: null}, // TODO: re-do with Google Cloud Messaging (should be easy)
        // 'Push notifications': {
        //   value: pushToken || AsyncStorage.getItem(PUSH_TOKEN) ? 'Enabled ✅' : 'Disabled ❌',
        //   onPress: onSetPushNotifications,
        // },
        Location: {
          value: locationPermissionGranted ? 'Enabled ✅' : 'Disabled ❌',
          onPress: enableLocation,
        },
      },
    ],
    [
      'Profile',
      {
        Username: {value: user?.name ? '@' + user?.name : null},
        Phone: {value: user?.phone ? formatPhone(user.phone) : null},
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
        <SettingItem
          name={'Sign out'}
          icon="➡️"
          value=""
          dangerous
          onPress={() => {
            logout()
          }}
        />
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
