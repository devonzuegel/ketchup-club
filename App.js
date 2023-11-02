import axios from 'axios'
import * as SQLite from 'expo-sqlite'
import {StyleSheet, Text as RNText, View, TouchableWithoutFeedback, Keyboard, Dimensions} from 'react-native'
import {Button, Text, fonts} from './Utils'

import * as Location from 'expo-location'
import React, {useRef, useState} from 'react'
import {useFonts} from 'expo-font'

// TODO: only call this when  ios/android; move to different file
import MapView, {/*Heatmap,*/ PROVIDER_DEFAULT} from 'react-native-maps'
import {LoginScreen} from './Login'

// open or create a database
const db = SQLite.openDatabase('smallworld.db')

db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL, timestamp INTEGER)'
  )
  tx.executeSql('SELECT name FROM sqlite_master WHERE type="table"', [], (_, {rows}) => console.log('tables:', rows._array))
})

let {height, width} = Dimensions.get('window')
const containerPadding = 16

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'SFCompactRounded_Medium',
    backgroundColor: 'black',
    padding: containerPadding,
  },
  map: {
    height: 70,
    width: width - 2 * containerPadding,
    marginTop: 12,
    marginBottom: 12,
    border: '10px solid black',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    columnGap: 8,
  },
  one_third_button: {
    flex: 1,
    justifyContent: 'center',
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

function LocationButton({title, getLocation, setPoints, mapRef}) {
  return (
    <Button
      title={title}
      style={styles.one_third_button}
      onPress={async () => {
        try {
          const result = await getLocation()
          storeLocation(result)
          setPoints((prevPoints) => [...prevPoints, result])
          mapRef.current.animateCamera({
            center: result,
            zoom: 14,
          })

          axios
            .get('https://smallworld.kiwi/api/v1/login')
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

  const [fontsLoaded] = useFonts(fonts)

  if (!fontsLoaded) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LoginScreen />
        <View>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            mapType="standard"
            region={{...miamiBeach, longitudeDelta: 20, latitudeDelta: 20}}>
            {/* <Heatmap opacity={0.6} radius={50} points={points} /> */}
          </MapView>
        </View>
        <View style={styles.row}>
          <LocationButton title="🌉 SF" setPoints={setPoints} mapRef={mapRef} getLocation={async () => sanFrancisco} />
          <LocationButton title="🌺 MB" setPoints={setPoints} mapRef={mapRef} getLocation={async () => miamiBeach} />
          <LocationButton title="📍 Now" setPoints={setPoints} mapRef={mapRef} getLocation={getCurrentLocation} />
        </View>

        <Button
          title="Clear locations from map"
          onPress={async () => {
            setPoints(() => [])
          }}
        />
        <Button
          title="Load locations from db"
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
    </TouchableWithoutFeedback>
  )
}
