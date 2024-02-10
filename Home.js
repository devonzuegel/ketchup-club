import React from 'react'
import {StyleSheet, View, AppState} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation, GlobalContext, formatPhone, themes} from './Utils'
import {callNumber} from './Phone'
import {fetchFriends} from './Friends'
import api from './API'

const setOfflineAfterNMins = 15
const nSecondsFetchFriends = 5

function OnlineOfflineToggle() {
  const [pingInterval, setPingInterval] = React.useState(null)
  const {setFriends, phone, theme, authToken, status, setStatus} = React.useContext(GlobalContext)

  const refreshStatusFromDB = async () => {
    try {
      await fetchFriends(authToken, (freshFriends) => {
        setFriends(freshFriends)
        const myPhone = phone
        const myProfile = freshFriends ? freshFriends.find(({phone: thisPhone}) => thisPhone == myPhone) : null
        const lastUpdatedDate = new Date(myProfile?.updated_at)
        const lastUpdatedMins = (Date.now() - lastUpdatedDate) / 1000 / 60
        if (myProfile?.status) {
          const newStatus = lastUpdatedMins < setOfflineAfterNMins ? myProfile.status : 'offline' // if last updated >N mins ago, set to offline
          console.log(JSON.stringify({authToken, lastUpdatedMins, statusFromDB: myProfile?.status, newStatus}, null, 2))
          setStatus(newStatus)
          // once we've calculated the new status, update the db
          // TODO: send the user a push notification letting them know we set them to offline automatically
          api.post('/ping', null, {
            params: {status: newStatus},
            headers: {Authorization: `Bearer ${authToken}`},
          })
        }
      })()
    } catch (error) {
      console.error(error)
    }
  }

  async function pingServer({status}) {
    console.log(new Date(Date.now()).toLocaleString() + ' pingServer – new status: ' + status)
    api
      .post('/ping', null, {
        params: {status},
        headers: {Authorization: `Bearer ${authToken}`},
      })
      .then((result) => console.log('        pingServer result:', result.data))
      .catch((error) => console.log('        pingServer  error:', error))
  }

  const handleAppGoesToForeground = () => {
    console.log(authToken.slice(-5) + '  —  App has come to the foreground! 👀 ')
    fetchFriends(authToken, setFriends)()
    refreshStatusFromDB()
  }

  const handleAppGoesToBackground = () => {
    console.log(authToken.slice(-5) + '  —  App has gone to the background 🙈 ')
    clearInterval(pingInterval)
  }

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') handleAppGoesToForeground()
      if (nextAppState === 'background') handleAppGoesToBackground()
    }
    AppState.addEventListener('change', handleAppStateChange)

    // fetchFriends(authToken, setFriends)()
    refreshStatusFromDB()
    const refreshFriendsAndStatusInterval = setInterval(() => {
      // fetchFriends(authToken, setFriends)()
      refreshStatusFromDB()
    }, 1000 * nSecondsFetchFriends)
    return () => clearInterval(refreshFriendsAndStatusInterval)
  }, [])

  return (
    <View>
      <Header>Set your status</Header>
      <View style={homeStyles(theme).toggleOuter}>
        <View
          style={{
            ...homeStyles(theme).toggleBtn,
            backgroundColor: themes[theme].text_input_placeholder,
            ...(status == 'offline' ? homeStyles(theme).toggleBtnSelected : {backgroundColor: 'transparent'}),
          }}>
          <Text
            onPress={() => {
              setStatus('offline')
              pingServer({status: 'offline'}) //.then(() => setTimeout(fetchFriendsFn, 10))
              // clearInterval(pingInterval)
              console.log('set offline + ping interval cleared')
            }}
            style={{
              ...homeStyles(theme).toggleBtnText,
              ...(status == 'offline' ? homeStyles(theme).toggleBtnTextSelected : {}),
            }}>
            Offline
          </Text>
        </View>
        <View
          style={{
            ...homeStyles(theme).toggleBtn,
            backgroundColor: '#32C084',
            ...(status == 'online' ? homeStyles(theme).toggleBtnSelected : {backgroundColor: 'transparent'}),
          }}>
          <Text
            onPress={() => {
              setStatus('online')
              pingServer({status: 'online'}) //.then(() => setTimeout(fetchFriendsFn, 10))
              // startPingInterval()
            }}
            style={{...homeStyles(theme).toggleBtnText, ...(status == 'online' ? homeStyles(theme).toggleBtnTextSelected : {})}}>
            Online
          </Text>
        </View>
      </View>

      <Text
        style={{
          textAlign: 'center',
          fontSize: 15,
          color: themes[theme].text_tertiary,
          marginVertical: 6,
          fontFamily: 'SFCompactRounded_Medium',
          maxWidth: '80%',
          alignSelf: 'center',
        }}>
        If you don't use the app for {setOfflineAfterNMins} minutes, {'\n'}
        you'll be set to offline automatically
      </Text>
    </View>
  )
}

const longAgoInEnglish = (timestamp) => {
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

const longAgoInSeconds = (timestamp) => {
  const now = new Date().getTime()
  const diff = now - new Date(timestamp).getTime()
  return Math.floor(diff / 1000) + ' seconds ago'
}

const Friend = ({name, phoneNumber, last_ping}) => {
  const {theme} = React.useContext(GlobalContext)
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
        borderRadius: 8,
      }}>
      <View style={{}}>
        <Text style={{fontSize: 32, color: themes[theme].text_emphasis, fontFamily: 'SFCompactRounded_Semibold'}}>@{name}</Text>
        <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>online {longAgoInEnglish(last_ping)}</Text>
      </View>
      <Text style={{fontSize: 36}} onPress={() => callNumber(phoneNumber)}>
        📞
      </Text>
    </View>
  )
}

const Spacer = () => <View style={{marginTop: 48}} />

const minsAgo = (mins) => new Date().getTime() - 1000 * 60 * mins
const timestampWithinMins = (timestamp, nMins) => new Date(timestamp).getTime() > minsAgo(nMins)

export default function HomeScreen({navigation}) {
  const {friends, setFriends} = React.useContext(GlobalContext)
  const {phone, authToken} = React.useContext(GlobalContext)
  const user = friends ? friends.find(({phone: theirPhone}) => theirPhone == phone) : null

  const onlineFriends = friends
    ? friends
        .filter(({status, phone: theirPhone}) => status == 'online' && theirPhone != phone)
        .filter(({last_ping}) =>
          timestampWithinMins(
            last_ping,
            setOfflineAfterNMins //+ 1 // the +1 is to account for the fact that the server might be a few seconds behind
          )
        )
    : []

  const {theme} = React.useContext(GlobalContext)

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
            {/* TODO: in the future, we'll store the whole user in the global state and fetch that rather than doing this messy thing of finding the user in the list of friends */}
            {user && user.screen_name ? '@' + user.screen_name : formatPhone(phone)}
          </Text>
          ! Nice to see you
        </Header>
        <Spacer />
        <OnlineOfflineToggle />

        <Spacer />

        {/* <Pre data={{friends}} /> */}

        {onlineFriends.length < 1 ? <Header>No friends online right now</Header> : <Header>Friends online right now</Header>}
        {onlineFriends == null && <DotAnimation style={{alignSelf: 'center', width: 60, marginTop: 12}} />}
        {onlineFriends.length > 0 &&
          onlineFriends.map(({screen_name, phone, last_ping}, i) => (
            <Friend name={screen_name} phoneNumber={phone} last_ping={last_ping} key={i} />
          ))}
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}

const homeStyles = (theme) =>
  StyleSheet.create({
    toggleOuter: {
      backgroundColor: themes[theme].text_input_bkgd,
      padding: 6,
      borderRadius: 100,
      margin: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    toggleBtn: {flex: 1, borderRadius: 100, padding: 14, flexDirection: 'column', justifyContent: 'center'},
    toggleBtnSelected: {
      color: 'white',
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 1,
    },
    toggleBtnText: {
      textAlign: 'center',
      fontSize: 32,
      fontFamily: 'SFCompactRounded_Semibold',
      color: themes[theme].text_input_placeholder,
    },
    toggleBtnTextSelected: {color: 'white'},
  })
