import {StyleSheet, View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {fonts, Text, Button, Pre} from './Utils'
import React, {useState} from 'react'
import {useFonts} from 'expo-font'
import {LoginScreen, AuthTokenContext, logout} from './Login'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

const containerPadding = 16

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'SFCompactRounded_Medium',
    backgroundColor: 'black',
    padding: containerPadding,
    paddingTop: 48,
    borderColor: '#222',
    borderStyle: 'dotted',
    borderWidth: 2,
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column', // inner items will be added vertically
    flexGrow: 1, // all the available vertical space will be occupied by it
    justifyContent: 'space-between', // will create the gutter between body and footer
  },
})

const NavBtns = ({navigation}) => {
  const getCurrentScreen = () => {
    const {routes, index} = navigation.getState()
    return routes[index].name
  }
  const isCurrentScreen = (screenName) => screenName == getCurrentScreen()
  return (
    <View>
      <View flexDirection="row" justifyContent="space-around" style={{marginBottom: 40}}>
        <Button
          title="Friends"
          btnStyle={isCurrentScreen('Friends') && {borderColor: 'white'}}
          textStyle={isCurrentScreen('Friends') && {color: 'white'}}
          onPress={() => navigation.navigate('Friends')}
        />
        <Button
          title="Home"
          btnStyle={isCurrentScreen('Home') && {borderColor: 'white'}}
          textStyle={isCurrentScreen('Home') && {color: 'white'}}
          onPress={() => navigation.push('Home', {itemId: Math.floor(Math.random() * 100)})}
        />
        <Button
          title="Settings"
          btnStyle={isCurrentScreen('Settings') && {borderColor: 'white'}}
          textStyle={isCurrentScreen('Settings') && {color: 'white'}}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>
  )
}
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

function HomeScreen({route, navigation}) {
  /* 2. Get the param */
  const {itemId, otherParam} = route.params
  return (
    <View style={{...styles.container, ...styles.flexColumn}}>
      <Text style={{fontSize: 54, textAlign: 'center'}}>Ketchup Club</Text>
      <View>
        <Text style={{textAlign: 'center', fontSize: 18}}>Set your status:</Text>
        <View
          style={{
            backgroundColor: '#222',
            padding: 6,
            borderRadius: 100,
            margin: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1, borderRadius: 100, padding: 14, flexDirection: 'column', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 30}}>Offline</Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: 100,
              padding: 14,
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'green',
              shadowColor: '#000',
              shadowOffset: {
                width: 1,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 1,
            }}>
            <Text style={{textAlign: 'center', fontSize: 30}}>Online</Text>
          </View>
        </View>
      </View>
      <Pre data={route.params} />
      <NavBtns navigation={navigation} />
    </View>
  )
}

function FriendsScreen({navigation}) {
  return (
    <View style={{...styles.container, ...styles.flexColumn}}>
      <Text>Friends</Text>
      <NavBtns navigation={navigation} />
    </View>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Pre data={{authToken}} />
          {/* <LoggedInNavigator /> */}
          {authToken ? <LoggedInNavigator /> : <LoginScreen />}
        </View>
      </TouchableWithoutFeedback>
    </AuthTokenContext.Provider>
  )
}
