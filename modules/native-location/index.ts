import {EventEmitter, Subscription} from 'expo-modules-core'
import NativeLocationModule from './src/NativeLocationModule'
import {LocationUpdatePayload, AuthorizationPayload, LocationErrorPayload} from './src/NativeLocation.types'

export async function startMonitoring() {
  NativeLocationModule.startMonitoring()
}

export async function stopMonitoring() {
  NativeLocationModule.stopMonitoring()
}

export async function requestPermission() {
  NativeLocationModule.requestPermission()
}

const emitter = NativeLocationModule ? new EventEmitter(NativeLocationModule) : null

export function addLocationUpdateListener(listener: (event: LocationUpdatePayload) => void): Subscription {
  if (emitter == null) {
    console.log('emitter is null')
    return {remove: () => {}}
  }
  return emitter.addListener<LocationUpdatePayload>('onLocationUpdate', listener)
}

export function addAuthorizationChangeListener(listener: (event: AuthorizationPayload) => void): Subscription {
  if (emitter == null) {
    console.log('emitter is null')
    return {remove: () => {}}
  }
  return emitter.addListener<AuthorizationPayload>('onAuthorizationChange', listener)
}

export function addLocationErrorListener(listener: (event: LocationErrorPayload) => void): Subscription {
  if (emitter == null) {
    console.log('emitter is null')
    return {remove: () => {}}
  }
  return emitter.addListener<LocationErrorPayload>('onLocationError', listener)
}

export {LocationUpdatePayload, AuthorizationPayload, LocationErrorPayload}
