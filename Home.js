import {StyleSheet, View} from 'react-native'
import {Text, styles, NavBtns} from './Utils'
import React from 'react'

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

const Header = ({children}) => <Text style={{textAlign: 'center', fontSize: 20, color: '#444', marginBottom: 4}}>{children}</Text>

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

const Friend = ({name}) => (
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
    <Text style={{fontSize: 32}}>📞</Text>
  </View>
)

export default function HomeScreen({navigation}) {
  return (
    <View style={{...styles.container, ...styles.flexColumn}}>
      <Text style={{fontSize: 54, textAlign: 'center', marginTop: 42, fontFamily: 'SFCompactRounded_Semibold'}}>
        Ketchup Club
      </Text>

      <OnlineOfflineToggle />

      <View>
        <Header>Friends online right now</Header>
        <Friend name="Alice" />
        <Friend name="Bob" />
        <Friend name="Charlie" />
      </View>

      <NavBtns navigation={navigation} />
    </View>
  )
}
