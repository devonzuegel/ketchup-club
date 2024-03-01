import {View, Keyboard, Dimensions, FlatList} from 'react-native'
import {Text, TextInput, styles, NavBtns, Header, DotAnimation, themes, formatPhone, Spacer} from './Utils'
import React from 'react'
import {StoreState, useStore} from './Store'
import {fs, User, Location, RenderedUser} from './Firestore'
import {FriendsScreenNavigationProp} from './App'

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

const formatLocation = (location: {city: string; region: string; country: string}) => {
  if (!location) return ''
  return `${location.city}, ${location.region}`
}

const Friend = ({
  name,
  phone,
  location,
}: {
  name: string
  phone: string
  location?: {city: string; region: string; country: string}
}) => {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
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
      <Text style={{fontSize: 32, color: themes[theme].text_emphasis, fontFamily: 'SFCompactRounded_Semibold'}}>@{name}</Text>
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        {location ? <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>{formatLocation(location)}</Text> : null}
        <Text style={{fontSize: 16, color: themes[theme].text_secondary}}>{formatPhone(phone)}</Text>
      </View>
      {/* <Text style={{fontSize: 32}}>{screen_name.length % 5 == 0 ? '🔔' : '🔕'}</Text> */}
    </View>
  )
}

export function FriendsScreen({navigation}: {navigation: FriendsScreenNavigationProp}) {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const friends = useStore((state: StoreState) => state.friends) as User[]
  const locations = useStore((state: StoreState) => state.locations) as Location[]
  const [friendsWithLocations, setFriendsWithLocations] = React.useState<RenderedUser[]>([])

  React.useEffect(() => {
    // console.log('friends:', friends)
    // console.log('locations:', locations)
    if (friends == null || locations == null) return
    const friendsWithLocations = friends.map((friend) => {
      const location = locations.find((loc) => loc.uid === friend.uid)
      return {...friend, location: location}
    })
    // console.log('friendsWithLocations:', friendsWithLocations)
    setFriendsWithLocations(friendsWithLocations)
  }, [friends, locations])

  return (
    <View
      style={{...styles(theme).container, ...styles(theme).flexColumn}}
      onStartShouldSetResponder={(evt) => {
        Keyboard.dismiss()
        return false
      }}>
      <View style={{marginTop: 48, flexDirection: 'column', flex: 1}}>
        <Header style={{fontSize: 28, color: themes[theme].text_secondary}}>Friends</Header>
        <SearchBar />
        <Spacer />
        {friendsWithLocations == null ? (
          <DotAnimation style={{alignSelf: 'center', width: 80, marginTop: 12}} />
        ) : (
          <View style={{flex: 1 /* fill the rest of the screen */}}>
            <FlatList
              data={friendsWithLocations}
              // renderItem={({item: {screen_name, phone}, id}) => <Friend screen_name={screen_name} phone={phone} />}
              renderItem={({item: {name, phone, location}}) => <Friend name={name} phone={phone} location={location} />}
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
