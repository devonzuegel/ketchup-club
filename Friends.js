import {View, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation} from './Utils'
import React from 'react'

export const FriendsContext = React.createContext() // allows access to key data throughout the app

export const FriendsProvider = ({children}) => {
  const [friends, setFriends] = React.useState(null)
  return <FriendsContext.Provider value={{friends, setFriends}}>{children}</FriendsContext.Provider>
}

export const mockFriends = [
  {phoneNumber: '+1-123-123-1234', name: 'Alicia'},
  {phoneNumber: '+1-123-123-1234', name: 'Bobby'},
  {phoneNumber: '+1-123-123-1234', name: 'Charlie'},
]

const SearchBar = () => (
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
      backgroundColor: '#222',
    }}>
    <Text style={{fontSize: 16}}>🔍</Text>
    <TextInput
      placeholder="Search"
      placeholderTextColor="#777"
      style={{width: Dimensions.get('window').width - 80, color: 'white', fontSize: 16, marginLeft: 6}}
    />
  </View>
)

const Friend = ({name}) => (
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
      backgroundColor: '#222',
      borderRadius: 8,
    }}>
    <Text style={{fontSize: 32}}>{name}</Text>
    <Text style={{fontSize: 32}}>{name.length % 5 == 0 ? '🔔' : '🔕'}</Text>
  </View>
)

export function FriendsScreen({navigation}) {
  // const friends = mockFriends.map((f) => f.name)
  // const {friends} = React.useContext(FriendsContext)
  const {friends, setFriends} = React.useContext(FriendsContext)
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{...styles.container, ...styles.flexColumn}}>
        <View style={{marginTop: 48}}>
          <Header>Friends</Header>
          <SearchBar />

          {friends == null ? (
            <DotAnimation style={{alignSelf: 'center', width: 60, marginTop: 12}} />
          ) : (
            friends.map(({screen_name}, i) => <Friend name={screen_name} key={i} />)
          )}
        </View>

        <NavBtns navigation={navigation} />
      </View>
    </TouchableWithoutFeedback>
  )
}
