import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text, styles, NavBtns, Header, Button} from './Utils'
import {callNumber} from './Phone'
import {mockFriends} from './Friends'
import api from './API'

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

const Friend = ({name, phoneNumber}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      margin: 4,
      backgroundColor: '#222',
      borderRadius: 8,
    }}>
    <Text style={{fontSize: 32}}>{name}</Text>
    <Text style={{fontSize: 32}} onPress={() => callNumber(phoneNumber)}>
      📞
    </Text>
  </View>
)

export default function HomeScreen({navigation}) {
  return (
    <View style={{...styles.container, ...styles.flexColumn}}>
      <Text style={{fontSize: 54, textAlign: 'center', marginTop: 42, fontFamily: 'SFCompactRounded_Semibold'}}>
        Ketchup Club
      </Text>

      <OnlineOfflineToggle />

      <Button
        title="get users"
        onPress={() => {
          api.get('/users').then((res) => {
            console.log('res.data:', res.data)
          })
        }}></Button>

      <View>
        <Header>Friends online right now</Header>

        {mockFriends.map(({name, phoneNumber}, i) => (
          <Friend name={name} phoneNumber={phoneNumber} key={i} />
        ))}
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
