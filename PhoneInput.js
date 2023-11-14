import React, {useState, useRef} from 'react'
import {SafeAreaView, View, TouchableOpacity, Text} from 'react-native'
import PhoneInput from 'react-native-phone-number-input'

const styles = {
  container: {},
  wrapper: {
    padding: 24,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#32C084',
    borderRadius: 4,
  },
  message: {
    padding: 12,
    marginTop: 24,
    backgroundColor: '#32C084',
    borderRadius: 4,
  },
}

const PhoneInputComponent = () => {
  const [value, setValue] = useState('')
  const [formattedValue, setFormattedValue] = useState('')
  const [valid, setValid] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const phoneInput = useRef()

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        {showMessage && (
          <View style={styles.message}>
            <Text>Value : {value}</Text>
            <Text>Formatted Value : {formattedValue}</Text>
            <Text>Valid : {valid ? 'true' : 'false'}</Text>
          </View>
        )}
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode="US"
          layout="first"
          onChangeText={(text) => {
            setValue(text)
          }}
          onChangeFormattedText={(text) => {
            setFormattedValue(text)
          }}
          withDarkTheme
          withShadow
          autoFocus
          textContentType="telephoneNumber"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const checkValid = phoneInput.current?.isValidNumber(value)
            setShowMessage(true)
            setValid(checkValid ? checkValid : false)
          }}>
          <Text>Check</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

export default PhoneInputComponent
