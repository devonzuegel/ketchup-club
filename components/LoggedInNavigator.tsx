import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp, createNativeStackNavigator} from '@react-navigation/native-stack'
import {FriendsScreen} from '../FriendsScreen'
import HomeScreen from '../HomeScreen'
import {ProfileScreen} from '../ProfileScreen'
import {SettingsScreen} from '../SettingsScreen'
import {StoreState, useStore} from '../Store'
import {themes} from '../Utils'

export type RootStackParamList = {
  Home: undefined
  Settings: undefined
  Friends: undefined
  Profile: {uid: string}
}

export type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>
}
export type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>
}
export type FriendsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Friends'>
}
export type ProfileScreenProps = {
  route?: RouteProp<RootStackParamList, 'Profile'>
  navigation?: NativeStackNavigationProp<RootStackParamList, 'Profile'>
}

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

export const LoggedInNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="HomeTabs">
      <Stack.Screen name="HomeTabs" options={{headerShown: false}}>
        {() => {
          return (
            <Tab.Navigator
              initialRouteName="Home"
              screenOptions={(props) => {
                const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
                const isActive = props.navigation.isFocused()
                return {
                  tabBarIcon: () => null, // remove icons
                  tabBarLabelStyle: {
                    fontSize: 16,
                    fontFamily: 'SFCompactRounded_Medium',
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isActive ? themes[theme].text_emphasis : themes[theme].text_input_placeholder,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    color: isActive ? themes[theme].text_emphasis : themes[theme].text_input_placeholder,
                  },
                  tabBarStyle: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    borderTopWidth: 0, // remove border
                  },
                }
              }}>
              <Tab.Screen name="Friends" component={FriendsScreen} options={{headerShown: false}} />
              <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
              <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
            </Tab.Navigator>
          )
        }}
      </Stack.Screen>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: true}} />
    </Stack.Navigator>
  </NavigationContainer>
)
