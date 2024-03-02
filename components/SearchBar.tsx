import {useStore, StoreState} from '../Store'
import {View, Text, TextInput, Dimensions} from 'react-native'
import {themes} from '../Utils'

export const SearchBar = () => {
  const theme = useStore((state: StoreState) => state.theme) as 'light' | 'dark'
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginTop: 10,
        marginBottom: 24,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: (themes[theme] as any).text_input_bkgd,
      }}>
      <Text style={{fontSize: 16}}>🔍</Text>
      <TextInput
        placeholder="Search for friends"
        style={{
          width: Dimensions.get('window').width - 80,
          height: 'auto',
          fontSize: 16,
          padding: 0,
          margin: 0,
          marginLeft: 6,
          backgroundColor: 'transparent',
        }}
      />
    </View>
  )
}

export default SearchBar
