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
    height: (1.5 * height) / 2,
    width: width,
    marginTop: 12,
  },
  button: {
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
})

const customMapStyle = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        weight: '0.5',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text',
    stylers: [
      {
        lightness: '-50',
      },
      {
        saturation: '-50',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text',
    stylers: [
      {
        hue: '#009aff',
      },
      {
        saturation: '25',
      },
      {
        lightness: '0',
      },
      {
        visibility: 'simplified',
      },
      {
        gamma: '1',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        saturation: '0',
      },
      {
        lightness: '100',
      },
      {
        gamma: '2.31',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        lightness: '20',
      },
      {
        gamma: '1',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'labels.text.fill',
    stylers: [
      {
        saturation: '-100',
      },
      {
        lightness: '-100',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        lightness: '0',
      },
      {
        saturation: '45',
      },
      {
        gamma: '4.24',
      },
      {
        visibility: 'simplified',
      },
      {
        hue: '#00ff90',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        saturation: '-100',
      },
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        color: '#666666',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [
      {
        saturation: '-25',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        lightness: '50',
      },
      {
        gamma: '.75',
      },
      {
        saturation: '100',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
]

const miamiBeach = {
  latitude: 25.790654,
  longitude: -80.1300455,
}
const sanFrancisco = {
  latitude: 37.7749,
  longitude: -122.4194,
}
// let points = [
//   {latitude: 25.770654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.771654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.772654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.773654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.774654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.775654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.776654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.777654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.778654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.779654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.780654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.781654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.782654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.783654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.784654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.785654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.786654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.787654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.788654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.789654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.790654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.791654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.792654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.793654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.794654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.795654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.796654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.797654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.798654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.799654, longitude: -80.1400455, weight: 1},
//   {latitude: 25.800654, longitude: -80.1400455, weight: 1},
// ]

let text = 'Waiting...'

export default function App() {
  const [location, setRegion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [points, setPoints] = useState([])
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
            const result = await getCurrentLocation()
            setPoints((prevPoints) => [...prevPoints, result])
            mapRef.current.animateCamera({
              center: result,
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
        customMapStyle={customMapStyle}
        region={{...miamiBeach, longitudeDelta: 20, latitudeDelta: 20}}>
        <Heatmap
          opacity={0.5}
          radius={100}
          gradient={{
            colors: ['grey'],
            startPoints: [0.1],
            colorMapSize: 500,
          }}
          points={points}
        />
        {/* <Heatmap
          points={points}
          opacity={1}
          radius={20000}
          maxIntensity={100}
          gradientSmoothing={100}
          heatmapMode="POINTS_DENSITY"
        /> */}
      </MapView>
    </View>
  )
}
