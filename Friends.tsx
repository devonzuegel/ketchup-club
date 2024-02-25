import {View, Keyboard, Dimensions, FlatList} from 'react-native'
import {Text, TextInput, styles, NavBtns, Header, DotAnimation, GlobalContext, themes, formatPhone, Spacer} from './Utils'
import api from './API'
import React from 'react'
import {StoreState, useStore} from './Store'

export const mockFriends = [
  {phoneNumber: '+1-123-123-1234', name: 'Alicia'},
  {phoneNumber: '+1-123-123-1234', name: 'Bobby'},
  {phoneNumber: '+1-123-123-1234', name: 'Charlie'},
]

// I need to figure out the type of the friends array
export const fetchFriends = (authToken: string, setFriends: React.Dispatch<React.SetStateAction<any[]>>) => async () => {
  console.log(authToken.slice(-5) + '  ' + new Date(Date.now()).toLocaleString() + ' fetchFriends — ')
  api
    .get('/users', {
      headers: {Authorization: `Bearer ${authToken}`},
    })
    .then((result) => {
      setFriends(result.data)
      // console.log('fetchFriends result count: ' + result.data.length)
      // console.log(
      //   JSON.stringify(
      //     result.data.map(({screen_name, phone}) => ({screen_name})),
      //     null,
      //     2
      //   )
      // )
      return result.data
    })
    .catch((err) => console.error('fetchFriends error:', err))
}

const SearchBar = () => {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
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
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: (themes[theme] as any).text_input_bkgd,
      }}>
      <Text style={{fontSize: 16}}>🔍</Text>
      <TextInput
        placeholder="Search for friends"
        style={{
          width: Dimensions.get('window').width - 80,
          height: 'auto',
          fontSize: 16,
          padding: 0,
          margin: 0,
          marginLeft: 6,
          backgroundColor: 'transparent',
        }}
      />
    </View>
  )
}

const Friend = ({screen_name, phone}: {screen_name: string; phone: string}) => {
  const {theme} = useStore((state: StoreState) => state) as StoreState
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

// Not sure what the type is here
// export function FriendsScreen({navigation}) {
export function FriendsScreen({navigation}: {navigation: any}) {
  const {friends, setFriends, authToken, phone} = React.useContext(GlobalContext) as {
    friends: any[]
    setFriends: React.Dispatch<React.SetStateAction<any[]>>
    authToken: string
    phone: string
  }
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  React.useEffect(() => {
    fetchFriends(authToken, setFriends)()
    // console.log('friends', JSON.stringify(friends, null, 2), '\n')
  }, [])

  const friendsExceptMe =
    friends &&
    friends.filter(({phone: theirPhone}: {phone: string}) => {
      // console.log('theirPhone', formatPhone(theirPhone), '  myPhone', formatPhone(phone))
      return formatPhone(theirPhone) !== formatPhone(phone)
    })

  return (
    <View
      style={{...styles(theme).container, ...styles(theme).flexColumn}}
      onStartShouldSetResponder={(evt) => {
        Keyboard.dismiss()
        return false
      }}>
      <View style={{marginTop: 48, flexDirection: 'column', flex: 1}}>
        <Header style={{fontSize: 28, color: themes[theme].text_secondary}}>Friends</Header>
        {/* <SearchBar /> */}
        <Spacer />
        {friendsExceptMe == null ? (
          <DotAnimation style={{alignSelf: 'center', width: 80, marginTop: 12}} />
        ) : (
          <View style={{flex: 1 /* fill the rest of the screen */}}>
            <FlatList
              data={friendsExceptMe}
              // renderItem={({item: {screen_name, phone}, id}) => <Friend screen_name={screen_name} phone={phone} />}
              renderItem={({item: {screen_name, phone}}) => <Friend screen_name={screen_name} phone={phone} />}
              keyExtractor={(meta_item, index) => index.toString()} //Add this line
              scrollEnabled
            />
          </View>
        )}
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
