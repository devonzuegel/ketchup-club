import * as React from 'react'
// import {RenderedUser} from './Firestore'
import {Button, Text} from './Utils'
import {ProfileScreenNavigationProp} from './App'
import {useStore, StoreState} from './Store'
import {RenderedUser} from './API'
import {RouteProp} from '@react-navigation/native'
import {View} from 'react-native'
import * as api from './API'

type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Friends: undefined
  Profile: {uid: string}
}

export const ProfileScreen = ({route}: RouteProp<RootStackParamList, 'Profile'>) => {
  const {uid} = route.params
  console.log('ProfileScreen: uid:', uid)
  const self = useStore((state: StoreState) => state.renderedUser) as RenderedUser
  const uFromStore = useStore((state: StoreState) => state.getUserForUID(uid)) as RenderedUser | null
  const [user, setUser] = React.useState<RenderedUser | null>(null)
  const [followerCount, setFollowerCount] = React.useState<number>(0)
  const [followingCount, setFollowingCount] = React.useState<number>(0)

  React.useEffect(() => {
    console.log('uid:', uid)
    if (uid === self.uid) {
      console.log('ProfileScreen: setting user to self')
      setUser(self)
    } else if (uFromStore != null) {
      setUser(uFromStore)
    } else {
      const getUser = async (uid: string) => {
        console.log('ProfileScreen: fetching user from server for uid:', uid)
        const u = await api.getUserForUID(uid)
        if (u != null) {
          setUser(u)
        }
      }
      getUser(uid)
    }
    const followingData = async (uid: string) => {
      setFollowerCount(await api.getFollowerCount(uid))
      setFollowingCount(await api.getFollowingCount(uid))
    }
    followingData(uid)
  }, [])

  return (
    <View>
      <Text>ProfileScreen</Text>
      <Text>uid: {uid}</Text>
      <Text>name: {user?.name}</Text>
      <Text>phone: {user?.phone}</Text>
      <Text>city: {user?.location?.city}</Text>
      <Text>region: {user?.location?.region}</Text>
      <Text>country: {user?.location?.country}</Text>
      <Text>online: {user?.status?.online ? 'true' : 'false'}</Text>
      <Text>online since: {user?.status?.went_online ? new Date(user?.status?.went_online?.toMillis()).toString() : ''}</Text>
      <Text>going offline: {user?.status?.expiry ? new Date(user?.status?.expiry.toMillis()).toString() : ''}</Text>
      <Text>followers count: {followerCount}</Text>
      <Text>following count: {followingCount}</Text>
      <Button
        title="Follow"
        onPress={() => {
          if (uid == null) return
          if (uid == self.uid) return
          api.follow(uid)
        }}
        btnStyle={undefined}
        textStyle={undefined}
      />
      <Button
        title="unfollow"
        onPress={() => {
          if (uid == null) return
          if (uid == self.uid) return
          api.unfollow(uid)
        }}
        btnStyle={undefined}
        textStyle={undefined}
      />
    </View>
  )
}
