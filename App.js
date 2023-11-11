import {View, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions} from 'react-native'
import {fonts, Text, Button, Pre, styles, NavBtns, Header} from './Utils'
import React, {useState} from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen, AuthTokenContext} from './Login'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from './Home'

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

const SettingItem = ({name, icon, dangerous, onPress}) => (
  <View
    onTouchEnd={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 14,
      paddingRight: 14,
      margin: 4,
      backgroundColor: '#222',
      borderRadius: 8,
    }}>
    <Text style={{fontSize: 18, fontFamily: 'SFCompactRounded_Regular', color: dangerous ? 'red' : 'white'}}>{name}</Text>
    <Text style={{fontSize: 18, fontFamily: 'SFCompactRounded_Regular', color: dangerous ? 'red' : 'white'}}>
      {icon || (name.length % 3 == 0 ? '✅' : '❌')}
    </Text>
  </View>
)

function SettingsScreen({navigation}) {
  const {authToken, setAuthToken} = React.useContext(AuthTokenContext)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    console.log('logout')
    setAuthToken(null)
    AsyncStorage.removeItem('authToken')
  }

  const settings = [
    ['System Permissions', ['Contacts', 'Push Notifications']],
    ['Profile', ['Username', 'Avatar']],
    ['Account', ['Phone']],
  ]

  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <View style={{...styles.container, ...styles.flexColumn}}>
        <View style={{marginTop: 48}}>
          <Header>Settings</Header>

          {settings.map(([section, sectionItems], i) => (
            <View key={i}>
              <Header style={{textAlign: 'left', fontSize: 16, marginLeft: 16, marginBottom: 2, marginTop: 18}}>{section}</Header>
              {sectionItems.map((name, j) => (
                <SettingItem name={name} key={j} />
              ))}
            </View>
          ))}
          <SettingItem name={'Sign out'} icon="➡️" dangerous onPress={logout} />
        </View>

        <NavBtns navigation={navigation} />
      </View>
    </AuthTokenContext.Provider>
  )
}

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
    <Text style={{fontSize: 32}}>{name.length % 3 == 0 ? '🔔' : '🔕'}</Text>
  </View>
)

function FriendsScreen({navigation}) {
  const friends = ['Alice', 'Bob', 'Charlie']
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{...styles.container, ...styles.flexColumn}}>
        <View style={{marginTop: 48}}>
          <Header>Friends</Header>
          <SearchBar />

          {friends.map((name, i) => (
            <Friend name={name} key={i} />
          ))}
        </View>

        <NavBtns navigation={navigation} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const Stack = createNativeStackNavigator()

const LoggedInNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" screenOptions={{animation: 'none'}}>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} initialParams={{itemId: 10}} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Friends" component={FriendsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default function App() {
  const [authToken, setAuthToken] = useState(null)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      {/* <View style={styles.container}>
          <Pre data={{authToken}} /> */}
      {authToken ? <LoggedInNavigator /> : <LoginScreen />}
      {/* </View> */}
    </AuthTokenContext.Provider>
  )
}
