import React, {useState, useRef} from 'react'
import {View, Keyboard} from 'react-native'
import {Button, Text, TextInput, styles, GlobalContext, countryCode, removeCountryCode, themes} from './Utils'
import PhoneInput from './PhoneInput'
import {store, useStore, StoreState} from './Store'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'

const debug = false

const stylesheet = {
  wrapper: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export const LoginScreen = () => {
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null)
  const [smsCode, setSmsCode] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [validPhone, setValidPhone] = useState(false)
  const [smsCodeEntered, setSmsCodeEntered] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  const smsCodeFieldRef = useRef()

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      console.log('🚀 ~ Login ~ onAuthStateChanged ~ user', user)
      setMessage("You're in!")
    }
  }

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    console.log('📲 signInWithPhoneNumber', phoneNumber)
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
      console.log('🚀 ~ Login ~ signInWithPhoneNumber ~ confirmation', confirmation)
      setConfirm(confirmation)
      smsCodeFieldRef.current?.focus()
    } catch (error) {
      console.log('Failed to sign in with phone number: ', error)
    }
  }

  const confirmCode = async () => {
    try {
      if (confirm) {
        await confirm.confirm(smsCode)
      } else {
        console.log('No confirmation result. Call signInWithPhoneNumber first.')
      }
    } catch (error) {
      console.log('Invalid code.')
    }
  }

  // const checkForErrors = async () => {
  //   if (phone === '' && smsCode === '') return setError("Oops, phone number and SMS code can't be blank!")
  //   if (phone === '') return setError("Oops, phone number can't be blank!")
  //   if (smsCode === '') return setError("Oops, SMS code can't be blank!")
  //   setError('') // clear error messages from screen
  // }

  const phoneInputView = () => {
    return (
      <PhoneInput
        // phone={removeCountryCode(phone)} // if pulling number from AsyncStorage, remove country code so that the country code is not displayed in the input field as a duplicate
        phone=""
        // defaultCountryCode={countryCode(phone)}
        defaultCountryCode="US"
        setPhone={setPhone}
        validPhone={validPhone}
        setValidPhone={(isValid) => {
          // if (isValid) setTimeout(() => smsCodeFieldRef.current?.focus(), 0)
          setValidPhone(isValid)
        }}
      />
    )
  }

  return (
    <View
      style={styles(theme).container}
      onStartShouldSetResponder={(evt) => {
        // Keyboard.dismiss()
        return false
      }}>
      <View>
        <Text style={{fontSize: 22, textAlign: 'center', color: themes[theme].text_secondary, marginTop: 120}}>Welcome to</Text>
        <Text style={{fontSize: 52, textAlign: 'center', color: themes[theme].text_primary, fontFamily: 'SFCompactRounded_Bold'}}>
          Ketchup Club
        </Text>
      </View>
      <View style={stylesheet.wrapper}>
        {/* The spaces at the end of the "error" & "message" fields are to prevent the text from jumping */}
        <Text style={{textAlign: 'center', color: 'red'}}>{error} </Text>
        <Text style={{textAlign: 'center', color: 'green'}}>{message} </Text>
        {phoneInputView()}
        {validPhone && !confirm && (
          <Button title="Confirm phone number →" onPress={() => signInWithPhoneNumber(phone)} btnStyle={null} textStyle={null} />
        )}

        {validPhone && confirm && (
          <TextInput
            style={{width: '80%'}}
            placeholder="SMS code"
            value={smsCode}
            ref={smsCodeFieldRef}
            onChangeText={(text: string) => {
              setSmsCode(text)
              if (text.length >= 6) {
                setSmsCodeEntered(true)
                // console.log('smsCodeEntered', smsCodeEntered)
              }
            }}
            autoCapitalize="none"
            keyboardType="number-pad"
          />
        )}
        {validPhone && smsCodeEntered && <Button title="Login →" onPress={confirmCode} btnStyle={null} textStyle={null} />}
      </View>
    </View>
  )
}
