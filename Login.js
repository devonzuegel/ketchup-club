import React, {useState, useRef, forwardRef} from 'react'
import {TextInput as RNTextInput, View} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {Button, Text, styles} from './Utils'
import {Keyboard, TouchableWithoutFeedback} from 'react-native'

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
  <RNTextInput
    ref={ref}
    placeholderTextColor="rgba(255, 255, 255, 0.4)"
    {...props}
    style={{...stylesheet.textInput, ...props.style}}
  />
))

const api = axios.create({
  baseURL: 'https://6c35-132-147-43-111.ngrok-free.app/api/v2',
})

export const LoginScreen = () => {
  const [phone, setPhone] = useState('')
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
    if (phone === '' && password === '') return setError("Oops, phone number and password can't be blank!")
    if (phone === '') return setError("Oops, phone number can't be blank!")
    if (password === '') return setError("Oops, password can't be blank!")
    setError(null) // clear error messages from screen

    try {
      const response = await api.post('/login', {params: {phone, password}})
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <Text style={{fontSize: 24, textAlign: 'center', color: '#50606C', marginTop: 120}}>Welcome to</Text>
          <Text style={{fontSize: 54, textAlign: 'center'}}>Ketchup Club</Text>
        </View>

        {/* The spaces at the end of the "error" & "message" fields are to prevent the text from jumping */}
        <Text style={{textAlign: 'center', color: 'red'}}>{error} </Text>
        <Text style={{textAlign: 'center', color: 'green'}}>{message} </Text>

        <TextInput
          placeholder="Phone number"
          value={phone}
          multiline={true} // this is a fake multiline, it's only here to get around the fact that iOS Text Replacements don't work with single line text inputs
          height={40}
          onChangeText={setPhone}
          returnKeyType="done"
          blurOnSubmit={true}
          style={{paddingTop: 10}}
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
    </TouchableWithoutFeedback>
  )
}
