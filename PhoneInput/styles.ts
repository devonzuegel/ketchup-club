import {StyleSheet, Dimensions} from 'react-native'
import {themes} from '../Utils'

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window')
function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}
function hp(percentage: number) {
  const value = (percentage * viewportHeight) / 100
  return Math.round(value)
}
const styles = StyleSheet.create({
  container: {
    width: '80%',
    flexDirection: 'row',
    height: 40,
    marginTop: 4,
    marginBottom: 4,
    color: 'black',
    fontFamily: 'SFCompactRounded_Medium',
    borderRadius: 10,
    backgroundColor: themes.light.text_input_bkgd,
  },
  flagButtonView: {
    height: '100%',
    marginLeft: 8,
    minWidth: 32,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagButtonExtraWidth: {
    width: wp(23),
  },
  shadow: {
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  dropDownImage: {
    height: 14,
    width: 12,
  },
  textContainer: {
    flex: 1,
    borderRadius: 10,
    borderLeftColor: 'white',
    textAlign: 'left',
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontFamily: 'SFCompactRounded_Medium',
    fontSize: 15,
    marginRight: 10,
    fontWeight: '500',
    color: '#000000',
  },
  numberText: {
    fontFamily: 'SFCompactRounded_Medium',
    fontSize: 15,
    color: '#000000',
    flex: 1,
  },
})

export default styles
