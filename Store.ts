import {useStore as use} from 'zustand'
import {createStore} from 'zustand/vanilla'
import {createJSONStorage, persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {User} from './Firestore'

export interface StoreState {
  user: User | null
  setUser: (u: User | null) => void
  friends: User[]
  setFriends: (f: User[]) => void
  onlineFriends: User[]
  setOnlineFriends: (f: User[]) => void
  locationPermissionGranted: boolean
  setLocationPermissionGranted: (lpg: boolean) => void
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  removeOnlineFriend: (id: string) => void
}

export const store = createStore<StoreState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (t: 'light' | 'dark') => set({theme: t}),
      locationPermissionGranted: false,
      setLocationPermissionGranted: (lpg: boolean) => set({locationPermissionGranted: lpg}),
      user: null,
      setUser: (u: User | null) => set({user: u}),
      friends: [],
      setFriends: (f: User[]) => set({friends: f}),
      onlineFriends: [],
      setOnlineFriends: (f: User[]) => set({onlineFriends: f}),
      removeOnlineFriend: (id: string) =>
        set((state: StoreState) => ({
          onlineFriends: state.onlineFriends.filter((user: User) => user.uid !== id),
        })),
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

      const {address} = useStore((state: StoreState) => state.address) as StoreState # in typescript

      or possibly better:

      const address = useStore((state: StoreState) => state.address) as string


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
