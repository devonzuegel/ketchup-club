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
        customMapStyle={[
          {
            elementType: 'geometry',
            stylers: [{color: '#ebe3cd'}],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#523735'}],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#f5f1e6'}],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#c9b2a6'}],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#dcd2be'}],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels',
            stylers: [{visibility: 'off'}],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [{visibility: 'off'}],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#93817c'}],
          },
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#a5b076'}],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text',
            stylers: [{visibility: 'off'}],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#f8c967'}],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#e98d58'}],
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#db8555'}],
          },
          {
            featureType: 'road.local',
            elementType: 'labels',
            stylers: [{visibility: 'off'}],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}],
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}],
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}],
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#b9d3c2'}],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#92998d'}],
          },
        ]}
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
