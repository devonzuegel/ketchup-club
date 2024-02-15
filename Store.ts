import {useStore as use} from 'zustand'
import {createStore} from 'zustand/vanilla'
import {createJSONStorage, persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {LocationGeocodedAddress, LocationObject} from 'expo-location'

export interface StoreState {
  address: LocationGeocodedAddress
  location: LocationObject
  locationPermissionGranted: boolean
  theme: string
  setAddress: (a: LocationGeocodedAddress) => void
  setLocation: (l: LocationObject) => void
  setLocationPermissionGranted: (lpg: boolean) => void
  setTheme: (t: string) => void
}

export const store = createStore(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (t: string) => set({theme: t}),
      address: null,
      setAddress: (a: LocationGeocodedAddress) => set({address: a}),
      location: null,
      setLocation: (l: LocationObject) => set({location: l}),
      locationPermissionGranted: false,
      setLocationPermissionGranted: (lpg: boolean) => set({locationPermissionGranted: lpg}),
    }),
    {
      name: 'global-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export const useStore = (selector: any) => use(store, selector)

/***************************
HOW TO USE THE ZUSTAND STORE

In a React component:
    First at the top of the file:
      import {useStore, StoreState} from './Store'

    Then in the function:
      const {address} = useStore() # in javascript

      or

      const {address} = useStore() as StoreState # in typescript

    The component will be bound to value in the store, so the UI will update when the store updates.

In a non-React file:
    First at the top of the file:
      import {store, StoreState} from './Store'

    Then in the function:
      const {setAddress} = store.getState() # in javascript

      or

      const {setAddress} = store.getState() as StoreState # in typescript

    The item will NOT be bound to the value in the store. To get a bound value, we may need to use the subscribe method, but I haven't tried that yet.

****************************/
