import * as ExpoLocation from 'expo-location'
import {store, StoreState} from './Store'
import {Platform} from 'react-native'
import * as NativeLocation from './modules/native-location'
import {Subscription} from 'expo-modules-core'
import Constants, {ExecutionEnvironment} from 'expo-constants'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {publishLocation, removeLocation} from './API'
import {throttle} from 'lodash'

/*

NativeLocation is not available on Expo or Android, but it can be imported because the native module uses requireOptionalNativeModule instead of requireNativeModule. This means that the app will not crash if the module is not available. However, referring to the module without verifying that we are not in Expo or Android will cause an error. So we need to check the execution environment before referring to the module.

(I wanted to use if(NativeLocation) but this doesn't work.)

*/

// const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient

class LocationController {
  private static instance: LocationController
  private static isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  private static useNativeLocation = Platform.OS === 'ios' && !this.isExpoGo
  private lastGeocodeTime = 0
  public lastPublishedLocation: {city: string; region: string; country: string} | null = null
  private lastGeocodedLocation: ExpoLocation.LocationObject | null = null
  private locationSubscription: Subscription | null = null
  private throttledReceiveLocationUpdate = throttle(this.receiveLocationUpdate, 2000)

  private constructor() {
    console.log('useNativeLocation:', LocationController.useNativeLocation)
    this.initializeSubscriptions()
    this.initializeLocationServices()
  }

  public static getInstance(): LocationController {
    if (!LocationController.instance) {
      LocationController.instance = new LocationController()
      console.log('Location instance created')
    }
    return LocationController.instance
  }

  private initializeSubscriptions() {
    if (LocationController.useNativeLocation) {
      const statusSubscription = NativeLocation.addAuthorizationChangeListener(({status: status}) => {
        console.log('NativeLocation permission status changed', status)

        // not determined = 0
        // restricted = 1
        // denied = 2
        // authorizedAlways = 3
        // authorizedWhenInUse = 4

        if (status === 3 || status === 4) {
          const {setLocationPermissionGranted} = store.getState() as StoreState
          setLocationPermissionGranted(true)
          this.startMonitoringLocation()
        } else if (status === 1 || status === 2) {
          const {setLocationPermissionGranted} = store.getState() as StoreState
          setLocationPermissionGranted(false)
          this.stopMonitoringLocation()
        }
      })

      const locationUpdateSubscription = NativeLocation.addLocationUpdateListener(({location: location}) => {
        // console.log('NativeLocation updated', location)
        this.throttledReceiveLocationUpdate(location)
      })

      const locationErrorSubscription = NativeLocation.addLocationErrorListener(({error: error}) => {
        console.log('NativeLocation error', error)
      })
    } else {
      console.log('NativeLocation module not in use')
    }
  }

  // use this function to start monitoring location on app startup
  private async initializeLocationServices() {
    auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const {setLocationPermissionGranted} = store.getState() as StoreState
          const {granted} = await ExpoLocation.getForegroundPermissionsAsync()
          if (granted) {
            this.startMonitoringLocation()
            setLocationPermissionGranted(true)
          }
        } catch (error) {
          console.error('Error occurred while getting foreground permissions:', error)
        }
      } else {
        this.stopMonitoringLocation()
      }
    })
  }

  public async requestLocationPermission() {
    if (LocationController.useNativeLocation) {
      NativeLocation.requestPermission()
      return
    } else {
      // For now we are only getting background location permission on iOS not using Expo Go
      var {granted} = await ExpoLocation.requestForegroundPermissionsAsync()
      const fg = granted
      const {setLocationPermissionGranted} = store.getState() as StoreState
      setLocationPermissionGranted(fg)
      if (fg) {
        this.startMonitoringLocation()
      }
    }
  }
  public async startMonitoringLocation() {
    if (LocationController.useNativeLocation) {
      NativeLocation.startMonitoring()
    } else {
      // note that the timeInterval parameter only works on Android and seems to negate distanceInterval, so don't use it
      // distanceInterval is definitely not working, so we may have to go with native code here to get the desired behavior
      this.locationSubscription = await ExpoLocation.watchPositionAsync(
        {distanceInterval: 500},
        this.throttledReceiveLocationUpdate
      )
    }
  }

  public stopMonitoringLocation() {
    if (LocationController.useNativeLocation) {
      NativeLocation.stopMonitoring()
    } else {
      this.locationSubscription?.remove()
    }
  }

  private receiveLocationUpdate(loc: ExpoLocation.LocationObject) {
    // console.log('Location updated', loc)
    if (loc == null) return
    if (loc === this.lastGeocodedLocation) return // trying to prevent multiple callbacks in quick succession

    if (LocationController.useNativeLocation) {
      locationService.performGeocode(loc)
    } else {
      // We need to conserve on-device geocoding resources. We have asked the Expo Location module to only send us updates every 500 meters, but it seems to give us updates more often than that. So we will only reverse geocode if at least two minutes have passed.
      if (loc.timestamp - this.lastGeocodeTime > 120000) {
        locationService.performGeocode(loc)
      } else {
        console.log('skipping reverse geocoding')
      }
    }
  }

  public async performGeocode(loc: ExpoLocation.LocationObject) {
    console.log('reverse geocoding location')
    this.lastGeocodedLocation = loc
    this.lastGeocodeTime = loc.timestamp
    const geocodeResult = await ExpoLocation.reverseGeocodeAsync(loc.coords)
    console.log(geocodeResult[0])
    locationService.pushLocation(loc, geocodeResult[0])
  }

  private async pushLocation(loc: ExpoLocation.LocationObject, address: ExpoLocation.LocationGeocodedAddress) {
    const location = {
      city: address.city!,
      region: address.region!,
      country: address.country!,
    }
    if (
      location.city === this.lastPublishedLocation?.city &&
      location.region === this.lastPublishedLocation?.region &&
      location.country === this.lastPublishedLocation?.country
    ) {
      return
    } else {
      this.lastPublishedLocation = location
      console.log('🌎 publishing location', location)
      publishLocation(location)
    }
  }
}

export const locationService = LocationController.getInstance()

// this function is triggered by the user on the settings page
export const enableLocation = () => {
  const {locationPermissionGranted, setLocationEnabled} = store.getState() as StoreState
  setLocationEnabled(true)
  if (locationPermissionGranted) {
    if (locationService.lastPublishedLocation != null) {
      publishLocation(locationService.lastPublishedLocation)
    }
    locationService.startMonitoringLocation()
    return
  } else {
    // this function will start monitoring if permission is granted
    locationService.requestLocationPermission()
  }
}

export const disableLocation = () => {
  locationService.stopMonitoringLocation()
  const {setLocationEnabled} = store.getState() as StoreState
  setLocationEnabled(false)
  removeLocation()
}
