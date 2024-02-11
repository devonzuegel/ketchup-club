import {useStore as use} from 'zustand'
import {createStore} from 'zustand/vanilla'
import {createJSONStorage, persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const store = createStore(
  persist(
    (set) => ({
      address: null,
      setAddress: (a) => set({address: a}),
      location: null,
      setLocation: (l) => set({location: l}),
      locationPermissionGranted: false,
      setLocationPermissionGranted: (lpg) => set({locationPermissionGranted: lpg}),
    }),
    {
      name: 'global-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export const useStore = (selector) => use(store, selector)

/***************************
HOW TO USE THE ZUSTAND STORE

In a React component:
    First at the top of the file:
      import {useStore} from './Store'

    Then in the function:
      const {address} = useStore()

    The component will be bound to value in the store, so the UI will update when the store updates.

In a non-React file:
    First at the top of the file:
      import {store} from './Store'

    Then in the function:
      const {setAddress} = store.getState()

    The item will NOT be bound to the value in the store. To get a bound value, we may need to use the subscribe method, but I haven't tried that yet.

****************************/
