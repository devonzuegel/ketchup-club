import * as Location from 'expo-location'

export var address = null
export var latestLocation = null
export var locationPermissionGranted = false

export async function requestLocationPermission() {
  const {granted} = await Location.requestForegroundPermissionsAsync()
  locationPermissionGranted = granted
  if (granted) {
    startMonitoringLocation()
  }
}

// use this function to start monitoring location on app startup
export async function checkLocationPermissions() {
  const {granted} = await Location.getForegroundPermissionsAsync()
  locationPermissionGranted = granted
  if (granted) {
    startMonitoringLocation()
  }
  return granted
}

// this function is triggered by the user on the settings page
export async function setLocationPermissions() {
  if (locationPermissionGranted) {
    startMonitoringLocation()
  } else {
    requestLocationPermission()
  }
}

function startMonitoringLocation() {
  // note that the timeInterval parameter only works on Android
  Location.watchPositionAsync({accuracy: 3, timeInterval: 120000, distanceInterval: 2000}, receiveLocationUpdate)
}

async function receiveLocationUpdate(location) {
  console.log('Location updated', location)
  // We need to conserve on-device geocoding resources. We have asked the system to only send us updates every 2km, but it seems to give us updates more often than that. So we will only reverse geocode if at least two minutes have passed or if address is null.
  if (address == null || latestLocation == null || location.timestamp - latestLocation.timestamp < 120000) {
    latestLocation = location
    console.log('reverse geocoding location')
    const geocodeResult = await Location.reverseGeocodeAsync(location.coords)
    console.log(geocodeResult[0])
    address = geocodeResult[0]
  } else {
    console.log('skipping reverse geocoding')
  }
}
