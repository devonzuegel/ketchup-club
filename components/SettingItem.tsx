import {useStore, StoreState} from '../Store'
import {View, TouchableOpacity} from 'react-native'
import {Text, themes} from '../Utils'

export const SettingItem = ({
  name,
  icon,
  value,
  dangerous,
  onPress,
}: {
  name: string
  icon: string
  value: string
  dangerous: boolean
  onPress: () => any
}) => {
  const theme = useStore((state: StoreState) => state.theme)
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        onTouchEnd={onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 14,
          paddingRight: 14,
          margin: 4,
          backgroundColor: themes[theme as 'light' | 'dark'].text_input_bkgd,
          borderRadius: 8,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'SFCompactRounded_Medium',
            lineHeight: 48, // Emojis have a different lineHeight than text, so this is to normalize between the two
            color: dangerous ? 'red' : themes[theme as 'light' | 'dark'].text_secondary,
          }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'SFCompactRounded_Medium',
            color: dangerous ? 'red' : themes[theme as 'light' | 'dark'].text_emphasis,
          }}>
          {value || icon || '🚧' || '❌'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default SettingItem
