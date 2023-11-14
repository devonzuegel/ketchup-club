import React, {useState, useRef} from 'react'
import {SafeAreaView, View, TouchableOpacity, Text} from 'react-native'
import PhoneInput from 'react-native-phone-number-input'

const styles = {
  wrapper: {
    padding: 24,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    padding: 12,
    marginTop: 24,
    backgroundColor: '#222',
    color: 'white',
    borderRadius: 4,
    justifyContent: 'left',
    width: 300,
    marginBottom: 12,
  },
  msgTxt: {color: 'white', fontFamily: 'Courier New'},
}

const PhoneInputComponent = () => {
  const [value, setValue] = useState('')
  const [formattedValue, setFormattedValue] = useState('')
  const [valid, setValid] = useState(false)
  const phoneInput = useRef()

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.message}>
          <Text style={styles.msgTxt}>········· Valid: {valid ? 'true' : 'false'}</Text>
          <Text style={styles.msgTxt}>········· Value: {value}</Text>
          <Text style={styles.msgTxt}>Formatted Value: {formattedValue}</Text>
        </View>
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="US"
          layout="first"
          onChangeText={(text) => {
            setValue(text)
            const checkValid = phoneInput.current?.isValidNumber(text)
            setValid(checkValid ? checkValid : false)
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
