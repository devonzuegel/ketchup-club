import React from 'react'
import {View, Text} from 'react-native'
import {useStore, StoreState} from '../Store'
import {themes, Header} from '../Utils'
import {StyleSheet} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import {Status, setStatusOnline, setStatusOffline} from '../API'

const setOfflineAfterNMins = __DEV__ ? 0.1 : 15

export const StatusToggle = () => {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const status = useStore((state: StoreState) => state.status) as Status | null

  const [timeRemaining, setTimeRemaining] = React.useState('eventually')

  React.useEffect(() => {
    const updateTimeRemaining = () => {
      if (status) {
        const expiry = status.expiry.toMillis()
        if (expiry) {
          setTimeRemaining(soonInEnglish(expiry))
        }
      }
    }

    let interval: NodeJS.Timeout

    if (status?.online) {
      updateTimeRemaining()
      interval = setInterval(updateTimeRemaining, 5000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [status])

  return (
    <View>
      <Header style={{}}>Set your status</Header>
      <View style={homeStyles(theme).toggleOuter}>
        <View
          style={{
            ...homeStyles(theme).toggleBtn,
            backgroundColor: themes[theme].text_input_placeholder,
            ...(!status?.online ? homeStyles(theme).toggleBtnSelected : {backgroundColor: 'transparent'}),
          }}>
          <Text
            onPress={() => {
              setStatusOffline()
            }}
            style={{
              ...homeStyles(theme).toggleBtnText,
              ...(!status?.online ? homeStyles(theme).toggleBtnTextSelected : {}),
            }}>
            Offline
          </Text>
        </View>
        <View
          style={{
            ...homeStyles(theme).toggleBtn,
            backgroundColor: '#32C084',
            ...(status?.online ? homeStyles(theme).toggleBtnSelected : {backgroundColor: 'transparent'}),
          }}>
          <Text
            onPress={() => {
              const expiry = firestore.Timestamp.fromMillis(Date.now() + setOfflineAfterNMins * 60 * 1000)
              setStatusOnline(expiry)
            }}
            style={{
              ...homeStyles(theme).toggleBtnText,
              ...(status?.online ? homeStyles(theme).toggleBtnTextSelected : {}),
            }}>
            Online
          </Text>
        </View>
      </View>

      <Text
        style={{
          textAlign: 'center',
          fontSize: 15,
          color: themes[theme].text_tertiary,
          marginVertical: 6,
          fontFamily: 'SFCompactRounded_Medium',
          maxWidth: '80%',
          alignSelf: 'center',
        }}>
        {!status?.online // TODO: make countdown timer dynamic
          ? "You'll go offline after " + setOfflineAfterNMins + ' minutes'
          : "You'll go offline " + timeRemaining}
      </Text>
    </View>
  )
}

const homeStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    toggleOuter: {
      backgroundColor: themes[theme].text_input_bkgd,
      padding: 6,
      borderRadius: 100,
      margin: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    toggleBtn: {flex: 1, borderRadius: 100, padding: 14, flexDirection: 'column', justifyContent: 'center'},
    toggleBtnSelected: {
      color: 'white',
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 1,
    },
    toggleBtnText: {
      textAlign: 'center',
      fontSize: 32,
      fontFamily: 'SFCompactRounded_Semibold',
      color: themes[theme].text_input_placeholder,
    },
    toggleBtnTextSelected: {color: 'white'},
  })

const soonInEnglish = (expiry: number) => {
  const now = new Date().getTime()
  const diff = now - new Date(expiry).getTime()
  if (diff > 0) return 'very soon'
  const seconds = Math.floor(-diff / 1000)
  const mins = Math.floor(seconds / 60)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(weeks / 4)
  const years = Math.floor(months / 12)
  if (seconds < 10) return 'in a few seconds'
  if (mins < 1) return 'in under a minute'
  if (mins == 1) return 'in about a minute'
  if (mins < 60) return `in ${mins} minutes`
  if (hours == 1) return 'in about an hour'
  if (hours < 24) return `in ${hours} hours`
  if (days == 1) return 'in about a day'
  return `in ${days} days`
}

export default StatusToggle
