import React, {useState, useRef} from 'react'
import {SafeAreaView, View, Text} from 'react-native'
import {debugStyles} from './Utils'
import PhoneInput from 'react-native-phone-number-input'

const debug = false

const PhoneInputComponent = ({phone, setPhone, validPhone, setValidPhone, phoneCountryCode, setPhoneCountryCode}) => {
  const ref = useRef()

  return (
    <>
      <SafeAreaView>
        {debug && (
          <View style={debugStyles.message}>
            <Text style={debugStyles.msgTxt}>········· Valid: {validPhone ? 'true' : 'false'}</Text>
            <Text style={debugStyles.msgTxt}>·········· Code: {phoneCountryCode}</Text>
            <Text style={debugStyles.msgTxt}>········· Phone: {phone}</Text>
          </View>
        )}
        <PhoneInput
          ref={ref}
          defaultValue={phone}
          defaultCode="US"
          layout="first"
          onChangeFormattedText={(formatted) => {
            const checkValid = ref.current?.isValidNumber(formatted)
            const callingCode = ref.current?.getCallingCode()
            const numberWithoutCode = formatted.replace(`+${callingCode}`, '')

            setPhoneCountryCode(callingCode)
            setPhone(numberWithoutCode)
            setValidPhone(checkValid)
          }}
          onChangeCountry={(text) => {
            console.log('onChangeCountry text:')
            console.log(JSON.stringify(text, null, 2))
            console.log()
          }}
          withDarkTheme
          withShadow
          autoFocus
          textContentType="telephoneNumber"
          // countryPickerButtonStyle={{backgroundColor: '#222', color: 'white'}}
          // textInputStyle={{backgroundColor: '#222', color: 'white'}}
          // textContainerStyle={{backgroundColor: '#222', color: 'white'}}
          // containerStyle={{backgroundColor: '#222', color: 'white'}}
          // flagButtonStyle={{backgroundColor: '#222', color: 'white'}}
          // codeTextStyle={{backgroundColor: '#222', color: 'white'}}
        />
      </SafeAreaView>
    </>
  )
}

export default PhoneInputComponent
