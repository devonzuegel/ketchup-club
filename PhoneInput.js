import React, {useState, useRef} from 'react'
import {SafeAreaView, View, Text} from 'react-native'
import {debugStyles} from './Utils'
import PhoneInput from 'react-native-phone-number-input'

const debug = false

const PhoneInputComponent = ({phone, setPhone, validPhone, setValidPhone}) => {
  const phoneInput = useRef()

  return (
    <>
      <SafeAreaView>
        {debug && (
          <View style={debugStyles.message}>
            <Text style={debugStyles.msgTxt}>········· Valid: {validPhone ? 'true' : 'false'}</Text>
            <Text style={debugStyles.msgTxt}>········· Value: {phone}</Text>
          </View>
        )}
        <PhoneInput
          ref={phoneInput}
          defaultValue={phone}
          defaultCode="US"
          layout="first"
          onChangeText={(text) => {}}
          onChangeFormattedText={(text) => {
            setPhone(text)
            const checkValid = phoneInput.current?.isValidNumber(text)
            setValidPhone(checkValid)
          }}
          withDarkTheme
          withShadow
          autoFocus
          textContentType="telephoneNumber"
        />
      </SafeAreaView>
    </>
  )
}

export default PhoneInputComponent
