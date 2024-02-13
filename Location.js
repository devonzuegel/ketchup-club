import * as Location from 'expo-location'
import {store} from './Store'

let lastGeocodeTime = 0

export async function requestLocationPermission() {
  var {granted} = await Location.requestForegroundPermissionsAsync()
  const fg = granted
  if (granted) {
    var {granted} = await Location.requestBackgroundPermissionsAsync()
  }
  const {setLocationPermissionGranted} = store.getState()
  setLocationPermissionGranted(fg)
  if (fg) {
    startMonitoringLocation()
  }
}

// use this function to start monitoring location on app startup
export async function checkLocationPermissions() {
  var {granted} = await Location.getForegroundPermissionsAsync()
  const fg = granted
  var {granted} = await Location.getBackgroundPermissionsAsync()
  const bg = granted
  if (fg && !bg) {
    var {granted} = await Location.requestBackgroundPermissionsAsync()
  }
  const {setLocationPermissionGranted} = store.getState()
  setLocationPermissionGranted(fg)
  if (fg) {
    startMonitoringLocation()
  }
  return granted
}

// this function is triggered by the user on the settings page
export async function enableLocation() {
  const {locationPermissionGranted} = store.getState()
  if (locationPermissionGranted) {
    startMonitoringLocation()
    return
  } else {
    requestLocationPermission()
  }
}

function startMonitoringLocation() {
  // note that the timeInterval parameter only works on Android and seems to negate distanceInterval, so don't use it
  // distanceInterval is definitely not working, so we may have to go with native code here to get the desired behavior
  Location.watchPositionAsync({distanceInterval: 2000}, receiveLocationUpdate)
}

async function receiveLocationUpdate(loc) {
  console.log('Location updated', loc)
  const {setLocation, setAddress} = store.getState()
  setLocation(loc)

  // We need to conserve on-device geocoding resources. We have asked the system to only send us updates every 2km, but it seems to give us updates more often than that. So we will only reverse geocode if at least two minutes have passed.
  if (loc.timestamp - lastGeocodeTime > 120000) {
    console.log('reverse geocoding location')
    lastGeocodeTime = loc.timestamp
    const geocodeResult = await Location.reverseGeocodeAsync(loc.coords)
    console.log(geocodeResult[0])
    setAddress(geocodeResult[0])
  } else {
    console.log('skipping reverse geocoding')
  }
}
