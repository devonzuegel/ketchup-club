import {StatusBar} from 'expo-status-bar'
import {StyleSheet, Dimensions, Text, View} from 'react-native'

// TODO: only call this when  ios/android; move to different file
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps'

let {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'pink',
    height: height,
    width: width,
  },
})

export default function App() {
  let location = {
    latitude: 23.259933,
    longitude: 77.412613,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        mapType="standard"
        region={location}>
        <Marker coordinate={{latitude: 23.25, longitude: 77.41}} />
      </MapView>
    </View>
  )
}
