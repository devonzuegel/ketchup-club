import {StyleSheet, Dimensions, Text, View, Button} from 'react-native'
import * as SQLite from 'expo-sqlite'
import axios from 'axios'

import React, {useState, useRef} from 'react'
import * as Location from 'expo-location'

// TODO: only call this when  ios/android; move to different file
import MapView, {/*Heatmap,*/ PROVIDER_DEFAULT} from 'react-native-maps'
import LoginScreen from './Login'

// open or create a database
const db = SQLite.openDatabase('smallworld.db')

db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL, timestamp INTEGER)'
  )
  tx.executeSql('SELECT name FROM sqlite_master WHERE type="table"', [], (_, {rows}) => console.log('tables:', rows._array))
})

let {height: windowHeight, width: windowWidth} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
  },
  map: {
    height: windowHeight / 3,

    width: windowWidth,
    marginTop: 12,
    marginBottom: 12,
    border: '10px solid black',
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

function LocationButton({title, getLocation, setPoints, mapRef}) {
  return (
    <Button
      title={title}
      onPress={async () => {
        try {
          const result = await getLocation()
          storeLocation(result)
          setPoints((prevPoints) => [...prevPoints, result])
          mapRef.current.animateCamera({
            center: result,
            zoom: 14,
          })

          // post with params
          axios
            .post('https://ba97-132-147-43-111.ngrok-free.app/api/v2/login', null, {
              params: {
                username: 'TODO: username',
                password: 'TODO: password',
              },
            })
            .then((response) => {
              console.log('response:')
              console.log(JSON.stringify(response, null, 2))
              console.log('response.data:')
              console.log(response.data)
            })
            .catch((error) => {
              console.log('error:')
              console.log(error)
            })
        } catch (error) {
          console.log('Error:', error.message)
        }
      }}
    />
  )
}

function storeLocation(result) {
  db.transaction((tx) => {
    tx.executeSql('INSERT INTO locations (latitude, longitude, timestamp) VALUES (?, ?, ?)', [
      result.latitude,
      result.longitude,
      Date.now(),
    ])
    tx.executeSql('SELECT * FROM locations', [], (_, {rows}) => {
      console.log('locations count:', rows._array.length)
    })
  })
}

export default function App() {
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

      console.log('getCurrentLocation:', result)

      return {
        latitude: result.coords.latitude + Math.random() / 100,
        longitude: result.coords.longitude + Math.random() / 100,
      }
    } catch (error) {
      console.log('Error:', error.message)
      return null // TODO: handle the error or return a default value
    }
  }

  return (
    <View style={styles.container}>
      <LoginScreen />
      <View style={{border: '3px solid red', backgroundColor: 'blue', marginTop: 30, paddingTop: 12, paddingBottom: 12}}>
        <Text>This is right ABOVE the map</Text>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          mapType="standard"
          customMapStyle={customMapStyle}
          region={{...miamiBeach, longitudeDelta: 20, latitudeDelta: 20}}>
          {/* <Heatmap opacity={0.6} radius={50} points={points} /> */}
        </MapView>
        <Text>This is right BELOW the map</Text>
      </View>
      <LocationButton title="🌉 San Francisco" setPoints={setPoints} mapRef={mapRef} getLocation={async () => sanFrancisco} />
      <LocationButton title="🌺 Miami Beach" setPoints={setPoints} mapRef={mapRef} getLocation={async () => miamiBeach} />
      <LocationButton title="📍 Current location" setPoints={setPoints} mapRef={mapRef} getLocation={getCurrentLocation} />
      <Button
        title="Clear locations from map"
        onPress={async () => {
          setPoints(() => [])
        }}
      />
      <Button
        title="Load locations from db into map"
        onPress={async () => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM locations', [], (_, {rows}) => {
              setPoints(() => rows._array)
            })
          })
        }}
      />
      <Button
        title="Delete locations from db & clear map"
        onPress={async () => {
          db.transaction((tx) => {
            tx.executeSql('DELETE FROM locations')
          })
          setPoints(() => [])
        }}
      />

      <Text>Point(s):</Text>
      {points.map((point, index) => (
        <Text key={index}>
          - {index + 1}: {point.latitude}, {point.longitude}
        </Text>
      ))}
    </View>
  )
}
