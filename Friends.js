import {View, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation, GlobalContext, themes, formatPhone} from './Utils'
import api from './API'
import React from 'react'

export const mockFriends = [
  {phoneNumber: '+1-123-123-1234', name: 'Alicia'},
  {phoneNumber: '+1-123-123-1234', name: 'Bobby'},
  {phoneNumber: '+1-123-123-1234', name: 'Charlie'},
]

export const fetchFriends = (setFriends) => async () => {
  console.log(new Date(Date.now()).toLocaleString() + ' fetchFriends')
  api
    .get('/users')
    .then((result) => setFriends(result.data))
    .catch((err) => console.error('fetchFriends error:', err))
}

const SearchBar = () => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
        marginBottom: 24,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 100,
        backgroundColor: themes[theme].text_input_bkgd,
      }}>
      <Text style={{fontSize: 16}}>🔍</Text>
      <TextInput
        placeholder="Search"
        placeholderTextColor={themes[theme].text_input_placeholder}
        style={{
          width: Dimensions.get('window').width - 80,
          color: themes[theme].text_secondary,
          fontSize: 16,
          marginLeft: 6,
        }}
      />
    </View>
  )
}

const Friend = ({screen_name, phone}) => {
  const {theme} = React.useContext(GlobalContext)
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 18,
        paddingRight: 18,
        margin: 4,
        backgroundColor: themes[theme].text_input_bkgd,
        borderRadius: 8,
      }}>
      <Text style={{fontSize: 32, color: themes[theme].text_emphasis, fontFamily: 'SFCompactRounded_Semibold'}}>
        @{screen_name}
      </Text>
      <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>{formatPhone(phone)}</Text>
      {/* <Text style={{fontSize: 32}}>{screen_name.length % 5 == 0 ? '🔔' : '🔕'}</Text> */}
    </View>
  )
}

export function FriendsScreen({navigation}) {
  const {friends, setFriends, theme} = React.useContext(GlobalContext)
  React.useEffect(() => {
    fetchFriends(setFriends)()
    console.log('friends', JSON.stringify(friends, null, 2), '\n')
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{...styles(theme).container, ...styles(theme).flexColumn}}>
        <View style={{marginTop: 48}}>
          <Header>Friends</Header>
          <SearchBar />

          {friends == null ? (
            <DotAnimation style={{alignSelf: 'center', width: 60, marginTop: 12}} />
          ) : (
            friends.map(({screen_name, phone}, i) => <Friend screen_name={screen_name} phone={phone} key={i} />)
          )}
        </View>

        <NavBtns navigation={navigation} />
      </View>
    </TouchableWithoutFeedback>
  )
}
