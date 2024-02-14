// import {Int32} from 'react-native/Libraries/Types/CodegenTypes'
import {LocationObject} from 'expo-location'

export type LocationUpdatePayload = {
  location: LocationObject
}

export type AuthorizationPayload = {
  status: number
}

export type LocationErrorPayload = {
  error: string
}
