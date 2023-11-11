import {StyleSheet, View} from 'react-native'
import {Text, styles, NavBtns} from './Utils'
import React from 'react'

const homeStyles = StyleSheet.create({
  toggleOuter: {
    backgroundColor: '#222',
    padding: 6,
    borderRadius: 100,
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleBtn: {flex: 1, borderRadius: 100, padding: 14, flexDirection: 'column', justifyContent: 'center'},
  toggleBtnSelected: {
    backgroundColor: 'green',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  toggleButtonText: {textAlign: 'center', fontSize: 32, fontFamily: 'SFCompactRounded_Semibold'},
})

export default function HomeScreen({navigation}) {
  return (
    <View style={{...styles.container, ...styles.flexColumn}}>
      <Text style={{fontSize: 54, textAlign: 'center'}}>Ketchup Club</Text>
      <View>
        <Text style={{textAlign: 'center', fontSize: 18}}>Set your status:</Text>
        <View style={homeStyles.toggleOuter}>
          <View style={homeStyles.toggleBtn}>
            <Text style={homeStyles.toggleButtonText}>Offline</Text>
          </View>
          <View style={{...homeStyles.toggleBtn, ...homeStyles.toggleBtnSelected}}>
            <Text style={homeStyles.toggleButtonText}>Online</Text>
          </View>
        </View>
      </View>
      <NavBtns navigation={navigation} />
    </View>
  )
}
