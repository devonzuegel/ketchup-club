import React from 'react'
import {View} from 'react-native'
import {styles, NavBtns, Header, formatPhone, themes} from './Utils'
import {disableLocation, enableLocation} from './Location'
import {useStore, StoreState} from './Store'
import auth from '@react-native-firebase/auth'
import {User} from './Firestore'
import {SettingsScreenNavigationProp} from './App'
import SettingItem from './components/SettingItem'

export function SettingsScreen({navigation}: {navigation: SettingsScreenNavigationProp}) {
  const user = useStore((state: StoreState) => state.user) as User | null

  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const setTheme = useStore((state: StoreState) => state.setTheme) as (theme: 'light' | 'dark') => void
  const locationPermissionGranted = useStore((state: StoreState) => state.locationPermissionGranted)
  const locationEnabled = useStore((state: StoreState) => state.locationEnabled)

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
          value: locationEnabled && locationPermissionGranted ? 'Enabled ✅' : 'Disabled ❌',
          onPress: locationEnabled && locationPermissionGranted ? disableLocation : enableLocation,
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
