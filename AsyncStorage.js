import AsyncStorage from '@react-native-async-storage/async-storage'

export const AUTH_TOKEN = 'authToken'
export const PHONE = 'phone'
export const THEME = 'theme'
export const PUSH_TOKEN = 'pushToken'

export default AsyncStorage

// TODO: wrap AsyncStorage so that its set and get methods only accept the keys defined above
