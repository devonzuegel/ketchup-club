import React from 'react'
import {StyleSheet, View, AppState, FlatList} from 'react-native'
import {Text, styles, NavBtns, Header, DotAnimation, GlobalContext, formatPhone, themes, Spacer} from './Utils'
import {useStore, StoreState} from './Store'
import {RenderedUser} from './API'
import {HomeScreenNavigationProp} from './App'
import StatusToggle from './components/StatusToggle'
import UserListItem from './components/UserListItem'

export default function HomeScreen({navigation}: {navigation: HomeScreenNavigationProp}) {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const user = useStore((state: StoreState) => state.renderedUser()) as RenderedUser | null
  const onlineFriends = useStore((state: StoreState) => state.onlineFriends()) as RenderedUser[]

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
        {user?.location?.city && (
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
            How's {user?.location.city}?
          </Text>
        )}
        <Spacer />
        <StatusToggle />

        <Spacer />

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
        <View>
          {onlineFriends.length > 0 && (
            <FlatList
              data={onlineFriends}
              renderItem={({item}) => <UserListItem {...item} />}
              keyExtractor={(meta_item, index) => index.toString()} //Add this line
              scrollEnabled
            />
          )}
        </View>
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
