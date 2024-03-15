import {View, Keyboard, Dimensions, FlatList} from 'react-native'
import {Text, TextInput, styles, Header, DotAnimation, themes, formatPhone, Spacer} from './Utils'
import React from 'react'
import {StoreState, useStore} from './Store'
import {RenderedUser} from './API'
import {FriendsScreenProps} from './components/LoggedInNavigator'
import UserListItem from './components/UserListItem'
import SearchBar from './components/SearchBar'

export const FriendsScreen: React.FC<FriendsScreenProps> = ({navigation}) => {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const friends = useStore((state: StoreState) => state.renderedFriends()) as RenderedUser[]

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
        {friends == null ? (
          <DotAnimation style={{alignSelf: 'center', width: 80, marginTop: 12}} />
        ) : (
          <View style={{flex: 1 /* fill the rest of the screen */}}>
            <FlatList
              data={friends}
              renderItem={({item}) => <UserListItem {...item} />}
              keyExtractor={(meta_item, index) => index.toString()} //Add this line
              scrollEnabled
            />
          </View>
        )}
      </View>

      {/* <NavBtns navigation={navigation} /> */}
    </View>
  )
}
