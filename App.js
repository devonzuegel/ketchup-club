import {StyleSheet, Dimensions, Text, View, Button} from 'react-native'

import React, {useState, useRef} from 'react'
import * as Location from 'expo-location'

// TODO: only call this when  ios/android; move to different file
import MapView, {Heatmap, PROVIDER_GOOGLE} from 'react-native-maps'

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
    height: (1.5 * height) / 2,
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

const miamiBeach = {
  latitude: 25.790654,
  longitude: -80.1300455,
}
const sanFrancisco = {
  latitude: 37.7749,
  longitude: -122.4194,
}

let text = 'Waiting...'

export default function App() {
  const [location, setRegion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const mapRef = useRef()

  // Function to generate a random location within a specified radius (in meters)
  getCurrentLocation = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        throw new Error('🔴 Location permission denied')
      } else {
        console.log('🟢 Location permission granted')
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low, // lower accuracy = faster response time
      })

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

  return (
    <View style={styles.container}>
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
        onPress={async () => {
          try {
            mapRef.current.animateCamera({
              center: await getCurrentLocation(),
              altitude: 10000000,
            })
          } catch (error) {
            console.log('Error:', error.message)
          }
        }}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        region={{...miamiBeach, longitudeDelta: 20, latitudeDelta: 20}}>
        <Heatmap
          opacity={0.95}
          radius={100}
          gradient={{
            colors: ['white'],
            startPoints: [0.1],
            colorMapSize: 1000,
          }}
          points={[
            {latitude: 25.770654, longitude: -80.1400455, weight: 1},
            {latitude: 25.775654, longitude: -80.1400455, weight: 1},
            {latitude: 25.780654, longitude: -80.1400455, weight: 1},
            {latitude: 25.785654, longitude: -80.1400455, weight: 1},
            {latitude: 25.790654, longitude: -80.1400455, weight: 1},
            {latitude: 25.795654, longitude: -80.1400455, weight: 1},
          ]}
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
