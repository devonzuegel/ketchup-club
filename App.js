import {StatusBar} from 'expo-status-bar'
import {StyleSheet, Dimensions, Text, View, Button} from 'react-native'

import React, {useState, useEffect, useRef} from 'react'
import * as Location from 'expo-location'

// TODO: only call this when  ios/android; move to different file
import MapView, {Heatmap, Marker, PROVIDER_GOOGLE} from 'react-native-maps'

let {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 24,
    marginRight: 24,
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'pink',
    height: height / 2,
    width: width,
    marginTop: 12,
  },
  button: {
    backgroundColor: 'pink',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
})

export default function App() {
  const [location, setRegion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const mapRef = useRef()

  const miamiBeach = {
    latitude: 25.790654,
    longitude: -80.1300455,
  }

  const sanFrancisco = {
    latitude: 37.7749,
    longitude: -122.4194,
  }

  const points = [
    {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
    {latitude: 6.82776681, longitude: 79.871319, weight: 1},
    {latitude: 6.82176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83776681, longitude: 79.871319, weight: 1},
    {latitude: 6.83176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83976681, longitude: 79.861319, weight: 1},
    {latitude: 6.83076681, longitude: 79.861319, weight: 1},
    {latitude: 6.82776681, longitude: 79.861319, weight: 1},
    {latitude: 6.82076681, longitude: 79.871319, weight: 1},
    {latitude: 6.82076681, longitude: 79.861319, weight: 1},
    {latitude: 6.81076681, longitude: 79.861319, weight: 1},
    {latitude: 6.83776681, longitude: 79.869319, weight: 1},
    {latitude: 6.83276681, longitude: 79.869319, weight: 1},
    {latitude: 6.81976681, longitude: 79.869319, weight: 1},
    {latitude: 6.83776681, longitude: 79.867319, weight: 1},
    {latitude: 6.83776681, longitude: 79.865319, weight: 1},
    {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
    {latitude: 6.82776681, longitude: 79.871319, weight: 1},
    {latitude: 6.82176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83776681, longitude: 79.871319, weight: 1},
    {latitude: 6.83176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83976681, longitude: 79.861319, weight: 1},
    {latitude: 6.83076681, longitude: 79.861319, weight: 1},
    {latitude: 6.82776681, longitude: 79.861319, weight: 1},
    {latitude: 6.82076681, longitude: 79.871319, weight: 1},
    {latitude: 6.82076681, longitude: 79.861319, weight: 1},
    {latitude: 6.81076681, longitude: 79.861319, weight: 1},
    {latitude: 6.83776681, longitude: 79.869319, weight: 1},
    {latitude: 6.83276681, longitude: 79.869319, weight: 1},
    {latitude: 6.81976681, longitude: 79.869319, weight: 1},
    {latitude: 6.83776681, longitude: 79.867319, weight: 1},
    {latitude: 6.83776681, longitude: 79.865319, weight: 1},
    {latitude: 6.84076681, longitude: 79.871319, weight: 1},
    {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
    {latitude: 6.82776681, longitude: 79.871319, weight: 1},
    {latitude: 6.82176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83776681, longitude: 79.871319, weight: 1},
    {latitude: 6.83176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83976681, longitude: 79.861319, weight: 1},
    {latitude: 6.83076681, longitude: 79.861319, weight: 1},
    {latitude: 6.82776681, longitude: 79.861319, weight: 1},
    {latitude: 6.82076681, longitude: 79.871319, weight: 1},
    {latitude: 6.82076681, longitude: 79.861319, weight: 1},
    {latitude: 6.81076681, longitude: 79.861319, weight: 1},
    {latitude: 6.83776681, longitude: 79.869319, weight: 1},
    {latitude: 6.83276681, longitude: 79.869319, weight: 1},
    {latitude: 6.81976681, longitude: 79.869319, weight: 1},
    {latitude: 6.83776681, longitude: 79.867319, weight: 1},
    {latitude: 6.83776681, longitude: 79.865319, weight: 1},
    {latitude: 6.84076681, longitude: 79.871319, weight: 1},
    {latitude: 6.841776681, longitude: 79.869319, weight: 1},
    {latitude: 6.83646681, longitude: 79.77121907, weight: 1},
    {latitude: 6.82776681, longitude: 79.871319, weight: 1},
    {latitude: 6.82176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83776681, longitude: 79.871319, weight: 1},
    {latitude: 6.83176681, longitude: 79.871319, weight: 1},
    {latitude: 6.83976681, longitude: 79.861319, weight: 1},
    {latitude: 6.83076681, longitude: 79.861319, weight: 1},
    {latitude: 6.82776681, longitude: 79.861319, weight: 1},
    {latitude: 6.82076681, longitude: 79.871319, weight: 1},
    {latitude: 6.82076681, longitude: 79.861319, weight: 1},
    {latitude: 6.81076681, longitude: 79.861319, weight: 1},
    {latitude: 6.83776681, longitude: 79.869319, weight: 1},
    {latitude: 6.83276681, longitude: 79.869319, weight: 1},
    {latitude: 6.81976681, longitude: 79.869319, weight: 1},
    {latitude: 6.83776681, longitude: 79.867319, weight: 1},
    {latitude: 6.83776681, longitude: 79.865319, weight: 1},
    {latitude: 6.84076681, longitude: 79.871319, weight: 1},
    {latitude: 6.841776681, longitude: 79.869319, weight: 1},
    {latitude: 6.84076681, longitude: 79.871319, weight: 1},
  ]

  // Function to generate a random location within a specified radius (in meters)
  getCurrentLocation = async (radius = 100000000000000) => {
    console.log('getting a location with radius ' + radius)
    try {
      const {status} = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') throw new Error('Location permission denied')
      else console.log('Location permission granted')

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      })

      console.log('result: ' + JSON.stringify(result, null, 2))

      return {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      }
    } catch (error) {
      console.log('Error:', error.message)
      // Handle the error or return a default value
      return null
    }
  }

  // useEffect(getLocation, [])

  let text = 'Waiting...'
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
      <Text style={styles.text}>Your location is: {text}</Text>
      <Button
        style={styles.button}
        title="San Francisco"
        onPress={() =>
          mapRef.current.animateCamera({
            center: sanFrancisco,
            altitude: 10000000,
          })
        }
      />
      <Button
        style={styles.button}
        title="Miami Beach"
        onPress={() =>
          mapRef.current.animateCamera({
            center: miamiBeach,
            altitude: 10000000,
          })
        }
      />
      <Button
        style={styles.button}
        title="Current location"
        onPress={
          () => console.log(getCurrentLocation())
          // mapRef.current.animateCamera({
          //   center: miamiBeach,
          //   altitude: 10000000,
          // })
        }
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        // onRegionChange={(region) => console.log('region changed to: ' + region)}
        region={{...miamiBeach, longitudeDelta: 20, latitudeDelta: 20}}>
        <Marker
          coordinate={miamiBeach}
          title="Miami Beach"
          description="Florida, USA"
        />
        {/* <Heatmap
          points={points}
          opacity={1}
          radius={20000}
          maxIntensity={100}
          gradientSmoothing={10}
          heatmapMode="POINTS_DENSITY"
        /> */}
      </MapView>
    </View>
  )
}
