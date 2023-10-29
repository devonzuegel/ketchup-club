import React, {useState} from 'react'
import {Button, TextInput, AsyncStorage, View, Text} from 'react-native'
import axios from 'axios'

const style = {
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    color: 'white',
  },
}
const LoginScreen = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    console.log('handleLogin called')

    if (username === '' && password === '') return setError("Oops, username and password can't be blank!")
    if (username === '') return setError("Oops, username can't be blank!")
    if (password === '') return setError("Oops, password can't be blank!")
    setError(null) // clear error

    try {
      const response = await axios.post('https://ba97-132-147-43-111.ngrok-free.app/api/v2/login', null, {
        params: {username, password},
      })

      console.log('\n\n        response: ', response)
      console.log('\n\nresponse.headers: ', response.headers)
      console.log('\n\n   response.data: ', response.data)
      if (response.data.success) {
        // Save session identifier locally
        await AsyncStorage.setItem('userSession', response.headers['set-cookie'])
      } else {
        // TODO: Handle login failure
        // ...
      }
    } catch (error) {
      // TODO: Handle error
      // ...
    }
  }

  return (
    <View style={{marginTop: 50, color: 'white'}}>
      <Text style={{color: 'red'}}>{error}</Text>
      <TextInput style={style.textInput} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={style.textInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{color: 'white'}}>username: "{username}"</Text>
      <Text style={{color: 'white'}}>password: "{password}"</Text>
    </View>
  )
}

export default LoginScreen
