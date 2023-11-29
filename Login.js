import React, {useState, useRef} from 'react'
import {View, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {PhoneNumberUtil} from 'google-libphonenumber'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Button, Text, TextInput, styles, GlobalContext, countryCode, removeCountryCode, themes} from './Utils'
import PhoneInput from './PhoneInput'
import api from './API'

const debug = false

const stylesheet = {
  wrapper: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export const LoginScreen = () => {
  const [smsCode, setSmsCode] = useState('')
  const [validPhone, setValidPhone] = useState(false)
  const [smsCodeEntered, setSmsCodeEntered] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const {setAuthToken, phone, setPhone, theme} = React.useContext(GlobalContext)
  const smsCodeFieldRef = useRef()

  // when this component loads, check if we have a token in AsyncStorage
  React.useEffect(() => {
    async function fetchAuthToken() {
      const authToken = await AsyncStorage.getItem('authToken')
      const phone = await AsyncStorage.getItem('phone')
      console.log('authToken from async storage: ', authToken || 'null')
      console.log('    phone from async storage: ', phone || 'null')

      // WARNING: storing in the component state AND in AsyncStorage may cause confusion in the future...
      //          ... but it's the best solution we have for now, so let's stick with it
      if (authToken) setAuthToken(authToken)
      if (phone) setPhone(phone)
    }
    console.log('fetching token from async storage..')
    fetchAuthToken()
  }, [])

  const handleLogin = async () => {
    if (phone === '' && smsCode === '') return setError("Oops, phone number and SMS code can't be blank!")
    if (phone === '') return setError("Oops, phone number can't be blank!")
    if (smsCode === '') return setError("Oops, SMS code can't be blank!")
    setError(null) // clear error messages from screen

    try {
      const response = await api.post('/login', null, {params: {phone, smsCode}})
      console.log('\n\nresponse.data: ', JSON.stringify(response.data, null, 2))

      if (response.data.success) {
        const token = response.data.authToken
        setAuthToken(token)
        setPhone(phone)
        await AsyncStorage.setItem('authToken', token)
        await AsyncStorage.setItem('phone', phone)
        setMessage(response.data.message)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      setError(error.message || 'Oops, something went wrong. Please try again.')
    }
  }

  /*
  const authenticatedRequest = (theAuthToken) => async () => {
    try {
      console.log('===========================================================')
      console.log('authToken: "' + theAuthToken + '"')
      const response = await api.get('/protected', {headers: {Authorization: `Bearer ${theAuthToken}`}})
      console.log('response.data:        ', response.data)
      console.log('response.data.success:', response.data.success)
      console.log('response.data.message:', response.data.message)
      if (response.data.success) {
        setMessage(response.data.message)
      } else {
        console.error(response.data.message)
        setError('Please log in, then try again')
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2))
      setError('Oops, something went wrong. Please try again')
    }
  }
  */
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles(theme).container}>
        <View>
          <Text style={{fontSize: 22, textAlign: 'center', color: themes[theme].text_secondary, marginTop: 120}}>Welcome to</Text>
          <Text
            style={{fontSize: 52, textAlign: 'center', color: themes[theme].text_primary, fontFamily: 'SFCompactRounded_Bold'}}>
            Ketchup Club
          </Text>
        </View>
        <View style={stylesheet.wrapper}>
          {/* The spaces at the end of the "error" & "message" fields are to prevent the text from jumping */}
          <Text style={{textAlign: 'center', color: 'red'}}>{error} </Text>
          <Text style={{textAlign: 'center', color: 'green'}}>{message} </Text>
          <PhoneInput
            phone={removeCountryCode(phone)} // if pulling number from AsyncStorage, remove country code so that the country code is not displayed in the input field as a duplicate
            defaultCountryCode={countryCode(phone)}
            setPhone={setPhone}
            validPhone={validPhone}
            setValidPhone={(isValid) => {
              if (isValid) setTimeout(() => smsCodeFieldRef.current.focus(), 0)
              setValidPhone(isValid)
            }}
          />
          {validPhone && (
            <TextInput
              style={{width: '80%'}}
              placeholder="SMS code"
              value={smsCode}
              ref={smsCodeFieldRef}
              onChangeText={(text) => {
                setSmsCode(text)
                if (text.length >= 4) setSmsCodeEntered(true)
              }}
              autoCapitalize="none"
              keyboardType="number-pad"
            />
          )}
          {validPhone && smsCodeEntered && <Button title="Login →" onPress={handleLogin} />}
        </View>

        {debug && (
          <>
            <Button title="Clear except AsyncStorage" onPress={clearExceptAsyncStorage} />
            <Button title="Test GOOD authenticated request" onPress={authenticatedRequest(authToken)} />
            <Button title="Test BAD authenticated request" onPress={authenticatedRequest('garbage')} />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}
