import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation, Pre} from './Utils'
import {callNumber} from './Phone'
import api from './API'
import {FriendsContext} from './Friends'

const homeStyles = StyleSheet.create({
  toggleOuter: {
    backgroundColor: '#222',
    padding: 6,
    borderRadius: 100,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleBtn: {flex: 1, borderRadius: 100, padding: 14, flexDirection: 'column', justifyContent: 'center'},
  toggleBtnSelected: {
    backgroundColor: '#32C084',
    color: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  toggleBtnText: {textAlign: 'center', fontSize: 32, fontFamily: 'SFCompactRounded_Semibold', color: '#777'},
  toggleBtnTextSelected: {color: 'white'},
})

const OnlineOfflineToggle = () => (
  <View>
    <Header>Set your status</Header>
    <View style={homeStyles.toggleOuter}>
      <View style={homeStyles.toggleBtn}>
        <Text style={homeStyles.toggleBtnText}>Offline</Text>
      </View>
      <View style={{...homeStyles.toggleBtn, ...homeStyles.toggleBtnSelected}}>
        <Text style={{...homeStyles.toggleBtnText, ...homeStyles.toggleBtnTextSelected}}>Online</Text>
      </View>
    </View>
  </View>
)

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

const Friend = ({name, phoneNumber, last_ping}) => (
  <View
    style={{
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      margin: 4,
      backgroundColor: '#222',
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: '#222',
      borderRadius: 8,
    }}>
    <View style={{}}>
      <Text style={{fontSize: 32}}>{name}</Text>
      <Text style={{fontSize: 16, fontFamily: 'SFCompactRounded_Light'}}>online {longAgoInEnglish(last_ping)}</Text>
    </View>
    <Text style={{fontSize: 36}} onPress={() => callNumber(phoneNumber)}>
      📞
    </Text>
  </View>
)

const Spacer = () => <View style={{marginTop: 48}} />

const minsAgo = (mins) => new Date().getTime() - 1000 * 60 * mins
const timestampWithinMins = (timestamp, nMins) => new Date(timestamp).getTime() > minsAgo(nMins)

export default function HomeScreen({navigation}) {
  // const [friends, setFriends] = React.useState(null)
  const {friends, setFriends} = React.useContext(FriendsContext)
  const onlineFriends = friends ? friends.filter(({last_ping}) => timestampWithinMins(last_ping, 20)) : []

  async function fetchFriends() {
    console.log(new Date(Date.now()).toLocaleString() + ' fetchFriends')
    api
      .get('/users')
      .then((result) => {
        setFriends(result.data)
      })
      .catch((err) => {
        console.log('fetchFriends error:', err)
      })
  }

  React.useEffect(() => {
    fetchFriends()
    const nSeconds = 5
    const interval = setInterval(fetchFriends, nSeconds * 1000)
    return () => clearInterval(interval) // clear interval on component unmount
  }, [])

  return (
    <View style={{...styles.container, ...styles.flexColumn}}>
      <View>
        <Text style={{fontSize: 54, textAlign: 'center', marginTop: 42, fontFamily: 'SFCompactRounded_Semibold'}}>
          Ketchup Club
        </Text>

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
