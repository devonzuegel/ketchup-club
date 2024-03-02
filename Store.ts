import {useStore as use} from 'zustand'
import {createStore} from 'zustand/vanilla'
import {createJSONStorage, persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {User, Status, Location, RenderedUser} from './Firestore'

export interface StoreState {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  user: User | null
  setUser: (u: User | null) => void
  status: Status | null
  setStatus: (s: Status | null) => void
  location: Location | null
  setLocation: (l: Location | null) => void
  renderedUser: () => RenderedUser | null
  friends: User[]
  setFriends: (f: User[]) => void
  statuses: Status[]
  setStatuses: (s: Status[]) => void
  removeStatus: (id: string) => void
  locations: Location[]
  setLocations: (l: Location[]) => void
  renderedFriends: () => RenderedUser[]
  onlineFriends: () => RenderedUser[]
  locationPermissionGranted: boolean
  setLocationPermissionGranted: (lpg: boolean) => void
  locationEnabled: boolean
  setLocationEnabled: (le: boolean) => void
}

export const store = createStore<StoreState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (t: 'light' | 'dark') => set({theme: t}),
      locationPermissionGranted: false,
      setLocationPermissionGranted: (lpg: boolean) => set({locationPermissionGranted: lpg}),
      locationEnabled: false,
      setLocationEnabled: (le: boolean) => set({locationEnabled: le}),
      user: null,
      setUser: (u: User | null) => set({user: u}),
      status: null,
      setStatus: (s: Status | null) => set({status: s}),
      location: null,
      setLocation: (l: Location | null) => set({location: l}),
      renderedUser: () => {
        const user = get().user
        const status = get().status
        const location = get().location
        if (!user) return null
        let u = user as RenderedUser
        u.status = status || undefined
        u.location = location || undefined
        return user
      },
      friends: [],
      setFriends: (f: User[]) => set({friends: f}),
      statuses: [],
      setStatuses: (s: Status[]) => set({statuses: s}),
      removeStatus: (id: string) =>
        set((state: StoreState) => ({
          statuses: state.statuses.filter((status: Status) => status.uid !== id),
        })),
      locations: [],
      setLocations: (l: Location[]) => set({locations: l}),
      renderedFriends: () => {
        const friends = get().friends
        const statuses = get().statuses //.filter((s: Status) => !s.expiry || s.expiry.toMillis() > Date.now())
        const locations = get().locations
        if (friends.length === 0) return []
        return friends.map((friend: User) => {
          const status = statuses.find((s: Status) => s.uid === friend.uid)
          const location = locations.find((l: Location) => l.uid === friend.uid)
          return {
            ...friend,
            status: status,
            location: location,
          }
        })
      },
      onlineFriends: () => {
        const renderedFriends = get().renderedFriends()
        if (renderedFriends.length === 0) return []
        return renderedFriends.filter((user: RenderedUser) => user.status?.online)
      },
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
