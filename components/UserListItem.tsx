import React from 'react'
import {StyleSheet, View, AppState} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation, GlobalContext, formatPhone, themes, Spacer} from '../Utils'
import {RenderedUser} from '../Firestore'
import {useStore, StoreState} from '../Store'
import {callNumber} from '../Phone'

export const UserListItem = (user: RenderedUser) => {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        margin: 4,
        backgroundColor: themes[theme].text_input_bkgd,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch'}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={{fontSize: 32, color: themes[theme].text_emphasis, fontFamily: 'SFCompactRounded_Semibold'}}>
              @{user.name}
            </Text>
          </View>
          <View id="meta-box" style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end'}}>
              {user.location ? (
                <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>{formatLocation(user.location!)}</Text>
              ) : null}
              <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>{formatPhone(user.phone)}</Text>
            </View>
            <View>
              <Text style={{fontSize: 36, paddingLeft: 5}} onPress={() => callNumber(user.phone)}>
                📞
              </Text>
            </View>
          </View>
        </View>
        {user.status?.went_online && (
          <View>
            <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>
              went online {longAgoInEnglish(user.status?.went_online.toMillis())}
            </Text>
          </View>
        )}
      </View>
      {/* <Text style={{fontSize: 32}}>{screen_name.length % 5 == 0 ? '🔔' : '🔕'}</Text> */}
    </View>
  )
}

const formatLocation = (location: {city: string; region: string; country: string}) => {
  if (!location) return ''
  return `${location.city}, ${location.region}`
}

const longAgoInEnglish = (timestamp: number) => {
  const now = new Date().getTime()
  const diff = now - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(weeks / 4)
  const years = Math.floor(months / 12)
  if (mins < 1) return 'just now'
  if (mins == 1) return '1 minute ago'
  if (mins < 60) return `${mins} minutes ago`
  if (hours == 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (days == 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (weeks == 1) return '1 week ago'
  if (weeks < 4) return `${weeks} weeks ago`
  if (months == 1) return '1 month ago'
  if (months < 12) return `${months} months ago`
  if (years == 1) return '1 year ago'
  return `${years} years ago`
}

export default UserListItem
