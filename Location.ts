import * as Location from 'expo-location'
import {store, StoreState} from './Store'
import {Platform} from 'react-native'
import * as NativeLocation from './modules/native-location'
import {Subscription} from 'expo-modules-core'
import Constants, {ExecutionEnvironment} from 'expo-constants'

/*

NativeLocation is not available on Expo or Android, but it can be imported because the native module uses requireOptionalNativeModule instead of requireNativeModule. This means that the app will not crash if the module is not available. However, referring to the module without verifying that we are not in Expo or Android will cause an error. So we need to check the execution environment before referring to the module.

(I wanted to use if(NativeLocation) but this doesn't work.)

*/

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient
const useNativeLocation = Platform.OS === 'ios' && !isExpoGo
console.log('useNativeLocation:', useNativeLocation)

let lastGeocodeTime = 0
let locationSubscription: Subscription | null = null

init()

function init() {
  initializeSubscriptions()
  initializeLocationServices()
}

function initializeSubscriptions() {
  if (useNativeLocation) {
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
        startMonitoringLocation()
      } else if (status === 1 || status === 2) {
        const {setLocationPermissionGranted} = store.getState() as StoreState
        setLocationPermissionGranted(false)
        stopMonitoringLocation()
      }
    })

    const locationUpdateSubscription = NativeLocation.addLocationUpdateListener(({location: location}) => {
      console.log('NativeLocation updated', location)
      receiveLocationUpdate(location)
    })

    const locationErrorSubscription = NativeLocation.addLocationErrorListener(({error: error}) => {
      console.log('NativeLocation error', error)
    })
  } else {
    console.log('NativeLocation module not in use')
  }
}

// use this function to start monitoring location on app startup
async function initializeLocationServices() {
  const {setLocationPermissionGranted} = store.getState() as StoreState
  const {granted} = await Location.getForegroundPermissionsAsync()
  if (granted) {
    startMonitoringLocation()
    setLocationPermissionGranted(true)
  }
}

// this function is triggered by the user on the settings page
export async function enableLocation() {
  const {locationPermissionGranted} = store.getState() as StoreState
  if (locationPermissionGranted) {
    startMonitoringLocation()
    return
  } else {
    // this function will start monitoring if permission is granted
    requestLocationPermission()
  }
}

async function requestLocationPermission() {
  if (useNativeLocation) {
    NativeLocation.requestPermission()
    return
  } else {
    // For now we are only getting background location permission on iOS not using Expo Go
    var {granted} = await Location.requestForegroundPermissionsAsync()
    const fg = granted
    const {setLocationPermissionGranted} = store.getState() as StoreState
    setLocationPermissionGranted(fg)
    if (fg) {
      startMonitoringLocation()
    }
  }
}

async function startMonitoringLocation() {
  if (useNativeLocation) {
    NativeLocation.startMonitoring()
  } else {
    // note that the timeInterval parameter only works on Android and seems to negate distanceInterval, so don't use it
    // distanceInterval is definitely not working, so we may have to go with native code here to get the desired behavior
    locationSubscription = await Location.watchPositionAsync({distanceInterval: 500}, receiveLocationUpdate)
  }
}

function stopMonitoringLocation() {
  if (useNativeLocation) {
    NativeLocation.stopMonitoring()
  } else {
    locationSubscription?.remove()
  }
}

async function receiveLocationUpdate(loc: Location.LocationObject) {
  console.log('Location updated', loc)
  if (loc == null) return

  const {setLocation} = store.getState() as StoreState
  setLocation(loc)
  if (useNativeLocation) {
    performGeocode(loc)
  } else {
    // We need to conserve on-device geocoding resources. We have asked the Expo Location module to only send us updates every 500 meters, but it seems to give us updates more often than that. So we will only reverse geocode if at least two minutes have passed.
    if (loc.timestamp - lastGeocodeTime > 120000) {
      performGeocode(loc)
    } else {
      console.log('skipping reverse geocoding')
    }
  }
}

async function performGeocode(loc: Location.LocationObject) {
  const {setAddress} = store.getState() as StoreState
  console.log('reverse geocoding location')
  lastGeocodeTime = loc.timestamp
  const geocodeResult = await Location.reverseGeocodeAsync(loc.coords)
  console.log(geocodeResult[0])
  setAddress(geocodeResult[0])
  publishLocation(loc, geocodeResult[0])
}

async function publishLocation(loc: Location.LocationObject, address: Location.LocationGeocodedAddress) {
  // We can use this function to publish location
}
