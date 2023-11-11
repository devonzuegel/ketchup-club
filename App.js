import {View, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions} from 'react-native'
import {fonts, Text, Button, Pre, styles, NavBtns, Header} from './Utils'
import React, {useState} from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen, AuthTokenContext} from './Login'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from './Home'

function SettingsScreen({navigation}) {
  const {authToken, setAuthToken} = React.useContext(AuthTokenContext)
  const [fontsLoaded] = useFonts(fonts)
  if (!fontsLoaded) return null

  const logout = () => {
    console.log('logout')
    setAuthToken(null)
    AsyncStorage.removeItem('authToken')
  }

  return (
    <AuthTokenContext.Provider value={{authToken, setAuthToken}}>
      <View style={{...styles.container, ...styles.flexColumn}}>
        <Text>Settings</Text>
        <Button title="Logout" onPress={logout} />
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: 4,
              marginRight: 4,
              marginTop: 24,
              marginBottom: 24,
              paddingTop: 6,
              paddingBottom: 6,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 8,
              backgroundColor: '#222',
            }}>
            <Text style={{fontSize: 16}}>🔍</Text>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#777"
              style={{width: Dimensions.get('window').width - 80, color: 'white', fontSize: 16, marginLeft: 6}}
            />
          </View>

          {friends.map((name) => (
            <Friend name={name} />
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
