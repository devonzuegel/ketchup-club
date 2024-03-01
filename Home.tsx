import React from 'react'
import {StyleSheet, View, AppState} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation, GlobalContext, formatPhone, themes, Spacer} from './Utils'
import {callNumber} from './Phone'
import {useStore, StoreState} from './Store'
import {fs, User, RenderedUser, Location, Status} from './Firestore'
import auth from '@react-native-firebase/auth'
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore'
import {HomeScreenNavigationProp} from './App'
import {StatusToggle} from './StatusToggle'

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

const longAgoInSeconds = (timestamp: number) => {
  const now = new Date().getTime()
  const diff = now - new Date(timestamp).getTime()
  return Math.floor(diff / 1000) + ' seconds ago'
}

const Friend = ({
  name,
  phoneNumber,
  went_online,
  expiry,
}: {
  name: string
  phoneNumber: string
  went_online?: FirebaseFirestoreTypes.Timestamp
  expiry?: FirebaseFirestoreTypes.Timestamp
}) => {
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
      <View style={{}}>
        <Text style={{fontSize: 32, color: themes[theme].text_emphasis, fontFamily: 'SFCompactRounded_Semibold'}}>@{name}</Text>
        {went_online ? (
          <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>
            went online {longAgoInEnglish(went_online.toMillis())}
          </Text>
        ) : null}
      </View>
      <Text style={{fontSize: 36}} onPress={() => callNumber(phoneNumber)}>
        📞
      </Text>
    </View>
  )
}

const minsAgo = (mins: number) => new Date().getTime() - 1000 * 60 * mins
const timestampWithinMins = (timestamp: number, nMins: number) => new Date(timestamp).getTime() > minsAgo(nMins)

export default function HomeScreen({navigation}: {navigation: HomeScreenNavigationProp}) {
  // const {theme, user, location, friends, statuses} = useStore((state: StoreState) => ({
  //   theme: state.theme,
  //   user: state.user,
  //   location: state.location,
  //   friends: state.onlineFriends,
  //   statuses: state.statuses,
  // })) as StoreState
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const user = useStore((state: StoreState) => state.user) as User | null
  const location = useStore((state: StoreState) => state.location) as Location
  const friends = useStore((state: StoreState) => state.friends) as User[] | null
  const statuses = useStore((state: StoreState) => state.statuses) as Status[] | null
  const [onlineFriends, setOnlineFriends] = React.useState<RenderedUser[]>([])

  React.useEffect(() => {
    if (friends == null || statuses == null) return
    const onlineFriends = friends
      .map((f) => {
        const status = statuses.find((s) => s.uid == f.uid)
        return {...f, status}
      })
      .filter((f) => f.status?.online)
    setOnlineFriends(onlineFriends)
  }, [friends, statuses])

  return (
    <View style={{...styles(theme).container, ...styles(theme).flexColumn}}>
      <View>
        <Text
          style={{
            fontSize: 52,
            textAlign: 'center',
            marginTop: 52,
            fontFamily: 'SFCompactRounded_Bold',
          }}>
          Ketchup Club
        </Text>

        {__DEV__ ? (
          <Text style={{textAlign: 'center', fontFamily: 'SFCompactRounded_Bold', color: 'orange'}}>DEV MODE</Text>
        ) : null}

        <Spacer />
        <Header
          style={{
            color: themes[theme].text_secondary,
            fontFamily: 'SFCompactRounded_Medium',
          }}>
          Hello,{' '}
          <Text
            style={{
              color: themes[theme].text_emphasis,
              fontFamily: 'SFCompactRounded_Bold',
            }}>
            {user && user.name ? '@' + user.name : formatPhone(user?.phone ?? '')}
          </Text>
          !
        </Header>
        {location?.city && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              color: themes[theme].text_tertiary,
              marginVertical: 2,
              fontFamily: 'SFCompactRounded_Medium',
              maxWidth: '80%',
              alignSelf: 'center',
            }}>
            How's {location.city}?
          </Text>
        )}
        <Spacer />
        <StatusToggle />

        <Spacer />

        {/* <Pre data={{friends}} /> */}

        {onlineFriends.length < 1 ? (
          <View>
            <Header style={{}}>No friends online right now</Header>

            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: themes[theme].text_tertiary,
                marginVertical: 2,
                fontFamily: 'SFCompactRounded_Medium',
                maxWidth: '80%',
                alignSelf: 'center',
              }}>
              But if you set your status to online,{'\n'}
              they'll give you a call if they're free!
            </Text>
          </View>
        ) : (
          <Header style={{}}>Friends online right now</Header>
        )}
        {onlineFriends == null && <DotAnimation style={{alignSelf: 'center', width: 60, marginTop: 12}} />}
        {onlineFriends.length > 0 &&
          onlineFriends.map(({name, phone, status}, i) =>
            status?.went_online ? (
              <Friend name={name} phoneNumber={phone} went_online={status.went_online} key={i} />
            ) : (
              <Friend name={name} phoneNumber={phone} key={i} />
            )
          )}
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
