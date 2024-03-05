import {EventEmitter, Subscription} from 'expo-modules-core'
import NativeLocationModule from './src/NativeLocationModule'
import {LocationUpdatePayload, AuthorizationPayload, LocationErrorPayload} from './src/NativeLocation.types'

class LocationManager {
  private emitter: EventEmitter | null

  constructor() {
    this.emitter = NativeLocationModule ? new EventEmitter(NativeLocationModule) : null
  }

  public async startMonitoring() {
    NativeLocationModule.startMonitoring()
  }

  public async stopMonitoring() {
    NativeLocationModule.stopMonitoring()
  }

  public async requestPermission() {
    NativeLocationModule.requestPermission()
  }

  public addLocationUpdateListener(listener: (event: LocationUpdatePayload) => void): Subscription {
    if (this.emitter == null) {
      console.log('emitter is null')
      return {remove: () => {}}
    }
    return this.emitter.addListener<LocationUpdatePayload>('onLocationUpdate', listener)
  }

  public addAuthorizationChangeListener(listener: (event: AuthorizationPayload) => void): Subscription {
    if (this.emitter == null) {
      console.log('emitter is null')
      return {remove: () => {}}
    }
    return this.emitter.addListener<AuthorizationPayload>('onAuthorizationChange', listener)
  }

  public addLocationErrorListener(listener: (event: LocationErrorPayload) => void): Subscription {
    if (this.emitter == null) {
      console.log('emitter is null')
      return {remove: () => {}}
    }
    return this.emitter.addListener<LocationErrorPayload>('onLocationError', listener)
  }
}

const nativeLocationManager = new LocationManager()

export default nativeLocationManager
