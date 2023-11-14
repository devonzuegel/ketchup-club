import React, {useState, useRef} from 'react'
import {SafeAreaView, View, Text} from 'react-native'
import {debugStyles} from './Utils'
import PhoneInput from 'react-native-phone-number-input'

const debug = true

const styles = {
  wrapper: {
    padding: 24,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const PhoneInputComponent = ({validPhone, setValidPhone}) => {
  const [value, setValue] = useState('')
  const [formattedValue, setFormattedValue] = useState('')
  const phoneInput = useRef()

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        {debug && (
          <View style={debugStyles.message}>
            <Text style={debugStyles.msgTxt}>········· Valid: {validPhone ? 'true' : 'false'}</Text>
            <Text style={debugStyles.msgTxt}>········· Value: {value}</Text>
            <Text style={debugStyles.msgTxt}>Formatted Value: {formattedValue}</Text>
          </View>
        )}
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="US"
          layout="first"
          onChangeText={(text) => {
            setValue(text)
            const checkValid = phoneInput.current?.isValidNumber(text)
            setValidPhone(checkValid ? checkValid : false)
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text)
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
