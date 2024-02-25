import React, {useState, useRef, PureComponent} from 'react'
import {SafeAreaView, View, Text, TouchableOpacity, Image, TextInput} from 'react-native'
import {debugStyles, GlobalContext, themes} from '../Utils'
import CountryPicker, {
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  CountryModalProvider,
  Flag,
} from 'react-native-country-picker-modal'
import {PhoneNumberUtil} from 'google-libphonenumber'
import styles from './styles'
import {useStore, StoreState} from '../Store'

const debug = false

const dropDown =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg=='
const phoneUtil = PhoneNumberUtil.getInstance()

class PhoneInput extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      code: props.defaultCode ? undefined : '91',
      number: props.value ? props.value : props.defaultValue ? props.defaultValue : '',
      modalVisible: false,
      countryCode: props.defaultCode ? props.defaultCode : 'IN',
      disabled: props.disabled || false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.disabled !== prevState.disabled) {
      if ((nextProps.value || nextProps.value === '') && nextProps.value !== prevState.number) {
        return {disabled: nextProps.disabled, number: nextProps.value}
      }
      return {disabled: nextProps.disabled}
    }
    return null
  }

  async componentDidMount() {
    const {defaultCode} = this.props
    if (defaultCode) {
      const code = await getCallingCode(defaultCode)
      this.setState({code})
    }
  }

  getCountryCode = () => {
    return this.state.countryCode
  }

  getCallingCode = () => {
    return this.state.code
  }

  isValidNumber = (number) => {
    try {
      const {countryCode} = this.state
      const parsedNumber = phoneUtil.parse(number, countryCode)
      return phoneUtil.isValidNumber(parsedNumber)
    } catch (err) {
      return false
    }
  }

  onSelect = (country) => {
    const {onChangeCountry} = this.props
    this.setState(
      {
        countryCode: country.cca2,
        code: country.callingCode[0],
      },
      () => {
        const {onChangeFormattedText} = this.props
        if (onChangeFormattedText) {
          if (country.callingCode[0]) {
            onChangeFormattedText(`+${country.callingCode[0]}${this.state.number}`)
          } else {
            onChangeFormattedText(this.state.number)
          }
        }
      }
    )
    if (onChangeCountry) {
      onChangeCountry(country)
    }
  }

  onChangeText = (text) => {
    this.setState({number: text})
    const {onChangeText, onChangeFormattedText} = this.props
    if (onChangeText) {
      onChangeText(text)
    }
    if (onChangeFormattedText) {
      const {code} = this.state
      if (code) {
        onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text)
      } else {
        onChangeFormattedText(text)
      }
    }
  }

  getNumberAfterPossiblyEliminatingZero() {
    let {number, code} = this.state
    if (number.length > 0 && number.startsWith('0')) {
      number = number.substr(1)
      return {number, formattedNumber: code ? `+${code}${number}` : number}
    } else {
      return {number, formattedNumber: code ? `+${code}${number}` : number}
    }
  }

  renderDropdownImage = () => {
    return <Image source={{uri: dropDown}} resizeMode="contain" style={styles.dropDownImage} />
  }

  renderFlagButton = (props) => {
    const {layout = 'first', flagSize} = this.props
    const {countryCode} = this.state
    if (layout === 'first') {
      return <Flag countryCode={countryCode} flagSize={flagSize ? flagSize : DEFAULT_THEME.flagSize} />
    }
    return <View />
  }

  render() {
    // const {theme} = React.useContext(GlobalContext)
    const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'

    interface PhoneInputProps {
      withDarkTheme: boolean
      codeTextStyle: object
      textInputProps: object
      textInputStyle: object
      autoFocus: boolean
      placeholder: string
      disableArrowIcon: boolean
      flagButtonStyle: object
      containerStyle: object
      textContainerStyle: object
      renderDropdownImage: object
      countryPickerProps: object
      filterProps: object
      countryPickerButtonStyle: object
      layout: string
    }

    const {
      withDarkTheme,
      codeTextStyle,
      textInputProps,
      textInputStyle,
      autoFocus,
      placeholder,
      disableArrowIcon,
      flagButtonStyle,
      containerStyle,
      textContainerStyle,
      renderDropdownImage,
      countryPickerProps = {},
      filterProps = {},
      countryPickerButtonStyle,
      layout = 'first',
    } = this.props as PhoneInputProps

    interface PhoneInputState {
      modalVisible: boolean
      code: string
      countryCode: string
      number: string
      disabled: boolean
    }

    const {modalVisible, code, countryCode, number, disabled} = this.state as PhoneInputState
    return (
      <CountryModalProvider>
        <View style={[styles.container, containerStyle ? containerStyle : {}]}>
          <TouchableOpacity
            style={[
              styles.flagButtonView,
              layout === 'second' ? styles.flagButtonExtraWidth : {},
              flagButtonStyle ? flagButtonStyle : {},
              countryPickerButtonStyle ? countryPickerButtonStyle : {},
            ]}
            disabled={disabled}
            onPress={() => this.setState({modalVisible: true})}>
            <CountryPicker
              onSelect={this.onSelect}
              withEmoji
              withFilter
              withFlag
              filterProps={filterProps}
              countryCode={countryCode}
              withCallingCode
              disableNativeModal={disabled}
              visible={modalVisible}
              theme={theme}
              renderFlagButton={this.renderFlagButton}
              onClose={() => this.setState({modalVisible: false})}
              {...countryPickerProps}
            />
            {code && layout === 'second' && (
              <Text style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}>{`+${code}`}</Text>
            )}
            {!disableArrowIcon && (
              <React.Fragment>{renderDropdownImage ? renderDropdownImage : this.renderDropdownImage()}</React.Fragment>
            )}
          </TouchableOpacity>
          <View style={[styles.textContainer, textContainerStyle ? textContainerStyle : {}]}>
            {code && layout === 'first' && (
              <Text style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}>{`+${code}`}</Text>
            )}
            <TextInput
              style={[styles.numberText, textInputStyle ? textInputStyle : {}]}
              placeholder={placeholder ? placeholder : 'Phone number'}
              placeholderTextColor={themes[theme].text_input_placeholder}
              onChangeText={this.onChangeText}
              value={number}
              editable={disabled ? false : true}
              selectionColor="black"
              keyboardAppearance={withDarkTheme ? 'dark' : 'default'}
              keyboardType="number-pad"
              autoFocus={autoFocus}
              {...textInputProps}
            />
          </View>
        </View>
      </CountryModalProvider>
    )
  }
}

export const isValidNumber = (number, countryCode) => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (err) {
    return false
  }
}

const PhoneInputComponent = ({
  phone,
  setPhone,
  validPhone,
  setValidPhone,
  defaultCountryCode,
}: {
  phone: string
  setPhone: (phone: string) => void
  validPhone: boolean
  setValidPhone: (validPhone: boolean) => void
  defaultCountryCode: string
}) => {
  const ref = useRef()
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'

  return (
    <>
      <SafeAreaView>
        {debug && (
          <View style={debugStyles(theme).message}>
            <Text style={debugStyles(theme).msgTxt}>········· Valid: {validPhone ? 'true' : 'false'}</Text>
            <Text style={debugStyles(theme).msgTxt}>········· Phone: {phone}</Text>
          </View>
        )}
        <PhoneInput
          disableArrowIcon
          ref={ref}
          defaultValue={phone}
          defaultCode={defaultCountryCode || 'US'}
          layout="first"
          onChangeFormattedText={(formatted) => {
            const checkValid = ref.current?.isValidNumber(formatted)
            setValidPhone(checkValid)
            setPhone(formatted)
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
        />
      </SafeAreaView>
    </>
  )
}

export default PhoneInputComponent
