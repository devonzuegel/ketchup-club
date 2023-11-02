import React, {useState, useRef, forwardRef} from 'react'
import {TextInput as RNTextInput, View} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {Button, Text} from './Utils'

const stylesheet = {
  textInput: {
    height: 40,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    padding: 10,
    color: 'white',
    fontFamily: 'SFCompactRounded_Medium',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}

export const AuthTokenContext = React.createContext() // allows access to the auth token throughout the app

const TextInput = forwardRef((props, ref) => (
  <RNTextInput ref={ref} style={stylesheet.textInput} placeholderTextColor="rgba(255, 255, 255, 0.4)" {...props} />
))

const api = axios.create({
  baseURL: 'https://f5f6-132-147-43-111.ngrok-free.app/api/v2',
})

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const {setAuthToken} = React.useContext(AuthTokenContext)
  const passwordFieldRef = useRef()

  // when this component loads, check if we have a token in AsyncStorage
  React.useEffect(() => {
    async function fetchAuthToken() {
      const authToken = await AsyncStorage.getItem('authToken')
      console.log('autToken from async storage: ', authToken || '[null]')
      setAuthToken(authToken) // storing in the component state AND in AsyncStorage may cause confusion in the future...
    }
    console.log('fetching token from async storage..')
    fetchAuthToken()
  }, [])

  const handleLogin = async () => {
    if (email === '' && password === '') return setError("Oops, email and password can't be blank!")
    if (email === '') return setError("Oops, email can't be blank!")
    if (password === '') return setError("Oops, password can't be blank!")
    setError(null) // clear error messages from screen

    try {
      const response = await api.post('/login', {params: {email: email, password}})
      setMessage(response.data.message)
      console.log('\n\nresponse.data: ', JSON.stringify(response.data, null, 2))

      if (response.data.success) {
        const token = response.data.authToken
        setAuthToken(token)
        await AsyncStorage.setItem('authToken', token)
      } else {
        throw new Error(response.data)
      }
    } catch (error) {
      console.error(error)
      setError('Oops, something went wrong. Please try again.')
    }
  }

  // const authenticatedRequest = (theAuthToken) => async () => {
  //   try {
  //     console.log('===========================================================')
  //     console.log('authToken: "' + theAuthToken + '"')
  //     const response = await api.get('/protected', {headers: {Authorization: `Bearer ${theAuthToken}`}})
  //     console.log('response.data:        ', response.data)
  //     console.log('response.data.success:', response.data.success)
  //     console.log('response.data.message:', response.data.message)
  //     if (response.data.success) {
  //       setMessage(response.data.message)
  //     } else {
  //       console.error(response.data.message)
  //       setError('Please log in, then try again')
  //     }
  //   } catch (error) {
  //     console.error(JSON.stringify(error, null, 2))
  //     setError('Oops, something went wrong. Please try again')
  //   }
  // }

  return (
    <View>
      <Text style={{fontSize: 54, textAlign: 'center', marginTop: 48, marginBottom: 48}}>Ketchup Club</Text>
      <Text style={{color: 'red'}}>{error}</Text>
      <Text style={{color: 'green'}}>{message}</Text>

      <TextInput
        placeholder="Email"
        value={email}
        multiline={true} // this is a fake multiline, it's only here to get around the fact that iOS Text Replacements don't work with single line text inputs
        height={40}
        onChangeText={setEmail}
        returnKeyType="done"
        blurOnSubmit={true}
        onSubmitEditing={() => passwordFieldRef.current.focus()}
        autoCorrect={true}
        numberOfLines={1}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        ref={passwordFieldRef}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      {/* <Button title="Clear except AsyncStorage" onPress={clearExceptAsyncStorage} />
      <Button title="Test GOOD authenticated request" onPress={authenticatedRequest(authToken)} />
      <Button title="Test BAD authenticated request" onPress={authenticatedRequest('garbage')} /> */}
    </View>
  )
}
