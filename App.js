import {StatusBar} from 'expo-status-bar'
import {StyleSheet, Text, View} from 'react-native'

// TODO: only call this when  ios/android; move to different file
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'

export default function App() {
  let location = {
    latitude: 23.259933,
    longitude: 77.412613,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>---------</Text>
      <Text>MapView:</Text>

      <Text>{JSON.stringify(StyleSheet.absoluteFill, null, 2)}</Text>

      <MapView
        styles={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        region={location}>
        <Marker coordinate={{latitude: 23.25, longitude: 77.41}} />
      </MapView>

      {/* <StatusBar style="auto" /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    border: '1px solid red',
    height: 400,
    width: 400,
  },
})
