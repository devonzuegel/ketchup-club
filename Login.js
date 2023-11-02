import React, {useState} from 'react'
import {TextInput as RNTextInput, AsyncStorage, View} from 'react-native'
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

const TextInput = (props) => (
  <RNTextInput style={stylesheet.textInput} placeholderTextColor="rgba(255, 255, 255, 0.4)" {...props} />
)

const api = axios.create({
  baseURL: 'https://f5f6-132-147-43-111.ngrok-free.app/api/v2',
})

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')

  const handleLogin = async () => {
    if (email === '' && password === '') return setError("Oops, email and password can't be blank!")
    if (email === '') return setError("Oops, email can't be blank!")
    if (password === '') return setError("Oops, password can't be blank!")
    setError(null) // clear errors from screen

    try {
      const response = await api.post('/login', {params: {email: email, password}})
      setMessage(response.data.message)
      console.log('\n\nresponse.data: ', JSON.stringify(response.data, null, 2))

      if (response.data.success) {
        const token = response.data.token
        setToken(token)
        // await AsyncStorage.setItem('token', token) // save JWT authentication token locally
      } else {
        throw new Error(response.data)
      }
    } catch (error) {
      console.error(error)
      setError('Oops, something went wrong. Please try again.')
    }
  }

  const authenticatedRequest = (theToken) => async () => {
    try {
      console.log('===========================================================')
      console.log('token:', theToken)
      const response = await api.get('/protected', {headers: {Authorization: `Bearer ${theToken}`}})
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={{marginTop: 50, color: 'white'}}>
      <Text>token: "{token}"</Text>
      <Text style={{color: 'red'}}>{error}</Text>
      <Text style={{color: 'green'}}>{message}</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} autoCapitalize="none" secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Test GOOD authenticated request" onPress={authenticatedRequest(token)} />
      <Button title="Test BAD authenticated request" onPress={authenticatedRequest('garbage')} />
    </View>
  )
}
