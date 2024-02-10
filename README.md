# Development

## Install dependencies

```sh
yarn install
```

## Frontend

This is the command Devon uses to run the frontend:
```sh
yarn start
```

If that doesn't work, this may work instead:
```sh
yarn add expo && npx expo start
```

## Backend

The backend is in the [`smallworld`](https://github.com/devonzuegel/smallworld) repo. (Yes, I was lazy and created just 1 backend to serve 3 different apps. Sue me.) Go to that repo to run the backend.

You will need to use `ngrok` to expose the backend to the internet. Run this command to do so:

```sh
ngrok http 3001 # or whatever port you have the backend running on
```

`ngrok` will give you a URL that you can use to access the backend from the frontend. Replace the first part of `DEVELOPMENT_URL` in `api.js` with the URL that `ngrok` gives you.

# Builds

# Internal build

```sh
eas build --profile preview --platform ios
```

## TestFlight build

```sh
bin/build-ios.sh
bin/submit-ios.sh
```

# TODOs

## Phase 1: Basic functionality

- [x] Store entire phone number and use `libphonenumber` to extract country code, instead of storing them separately: https://www.sitepoint.com/working-phone-numbers-javascript
- [x] Check in the background if a friend is online, and if so send a push notification to the user
- [x] Sign up flow
- [x] App icon & splash screen
- [x] Scroll the list of friends so it doesn't overflow the screen

## Phase 2: Before friends use it

- [x] Publish to TestFlight so other friends can use it
- [x] Push notification when a friend is online
  - [x] Review Sebas' PRs for the frontend and backend
  - [x] Handle how this is shown in the settings page
  - [x] Add a way for users to disable push notifications
    - [x] Delete the token from the database when they disable push notifications – or have a way to toggle whether the token is active, so that we don't have to ask for permission again if they want to re-enable push notifications
    - [x] Filter for people who don't have tokens
    - [ ] Fetch the token from the database if it exists, then make the settings page reflect that
- [x] Fix the online/offline state issue that Andy reported
  - [x] When you go online, then leave the app, then come back >N minutes later, it should show you as offline
  - when the app loads for the first time, if the user is ONLINE, it should start pinging the server every N seconds to ask for status
  - when the app goes to the background, it should stop the ping interval
  - when the app comes back to the foreground, if the user is ONLINE, it should start the ping interval again
  - if the user is OFFLINE, it should not start the ping interval
- [ ] Store `push notifications` & `theme` in AsyncStorage so they don't get reset every time they open the app
- [ ] Only show YOUR friends. Currently the app shows all users
- [ ] Dark theme improvements
  - [ ] Store the user's chosen theme in AsyncStorage so that it doesn't get reset every time they open the app
  - [ ] Make the splash screen match the theme

## Phase 3: Before making it public

- [ ] Give people a way to set how long they'll be online for, rather than just the default `setOfflineAfterNMins` value
- [ ] Fix sign in page dark mode
- [ ] Add an "About" link in the Settings page
- [ ] Landing page with link to TestFlight beta
- [ ] Have the PhoneInput component autosuggest the user's phone number. Note: This may require forking the library and adding the feature
- [ ] Add friends
  - [ ] Lucie L
- [ ] Style the whole app to match the design in Figma
- [ ] Add idea of "friends" and "friend requests", rather than having all users be friends with each other
- [ ] Make friend search actually work
- [ ] Protect all endpoints with authentication the same way `protected-endpoint` is protected

## Phase 4: Enhancements
- [ ] Home screen widget so that you can:
  - see who's online without opening the app
  - set your status without opening the app

## Phase 5: Low priority polish

- [ ] Push notification edge cases
    - [ ] What if the user has multiple devices?
    - [ ] What if the user disables push notifications from iOS settings, rather than via the app?
- [ ] Fix the screen flicker that happens at login. I think it's an issue of not using a proper navigation library. It may not be an issue if we simply stick with a white background, it might just be an issue while we have a black background
- [ ] Store the whole user in the global state and fetch that rather than doing this messy thing of finding the user in the list of friends. More details in `Home.js`
- [ ] Make the light/dark mode setting item into a pretty toggle element, rather than just clickable text
