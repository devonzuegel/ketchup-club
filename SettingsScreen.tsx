import React from 'react'
import {View} from 'react-native'
import {styles, NavBtns, Header, formatPhone, themes} from './Utils'
import {disableLocation, enableLocation} from './Location'
import {useStore, StoreState} from './Store'
import auth from '@react-native-firebase/auth'
import {User, updateLocationVisibility, updateStatusVisibility} from './API'
import {SettingsScreenNavigationProp} from './App'
import SettingItem from './components/SettingItem'
import {enableNotifications, disableNotifications} from './Push'
import {update} from 'lodash'

export const SettingsScreen = ({navigation}: {navigation: SettingsScreenNavigationProp}) => {
  const user = useStore((state: StoreState) => state.user) as User | null
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const setTheme = useStore((state: StoreState) => state.setTheme) as (theme: 'light' | 'dark') => void
  const locationPermissionGranted = useStore((state: StoreState) => state.locationPermissionGranted)
  const locationEnabled = useStore((state: StoreState) => state.locationEnabled)
  const notificationPermissionGranted = useStore((state: StoreState) => state.notificationPermissionGranted) as boolean
  const notificationsEnabled = useStore((state: StoreState) => state.notificationsEnabled) as boolean
  const locationVisibility = useStore((state: StoreState) => state.locationVisibility) as string
  const setLocationVisibility = useStore((state: StoreState) => state.setLocationVisibility) as (lv: string) => void
  const statusVisibility = useStore((state: StoreState) => state.statusVisibility) as string
  const setStatusVisibility = useStore((state: StoreState) => state.setStatusVisibility) as (sv: string) => void
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

  const toggleLocationVisility = async () => {
    if (locationVisibility == 'public') {
      setLocationVisibility('friends')
    } else {
      setLocationVisibility('public')
    }
    updateLocationVisibility()
  }

  const toggleStatusVisility = async () => {
    if (statusVisibility == 'public') {
      setStatusVisibility('friends')
    } else {
      setStatusVisibility('public')
    }
    updateStatusVisibility()
  }

  const stringForVisibility = (setting: string) => {
    if (setting == 'public') {
      return 'Public 🌎'
    }
    if (setting == 'friends') {
      return 'Friends 👯'
    }
    return 'Private 🔒'
  }

  const settings = [
    [
      'System Permissions', // We are calling this section "System Permissions", but note that when we allow the user to enable/disable location and push notifications, we are not actually changing the system permissions, we are just enabling/disabling the app's use of those permissions.
      {
        Contacts: {value: null}, // TODO: put me back
        // 'Push notifications': {value: null}, // TODO: re-do with Google Cloud Messaging (should be easy)
        'Push notifications': {
          value: notificationsEnabled && notificationPermissionGranted ? 'Enabled ✅' : 'Disabled ❌',
          onPress: notificationsEnabled && notificationPermissionGranted ? disableNotifications : enableNotifications,
        },
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
      'Visibility',
      {
        Location: {value: stringForVisibility(locationVisibility), onPress: toggleLocationVisility},
        Status: {value: stringForVisibility(statusVisibility), onPress: toggleStatusVisility},
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
