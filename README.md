# Development

```sh
yarn start
```

The backend is the same as the `small-world` project. Go to that repo to run the backend.

# TestFlight build

```sh
bin/build-ios.sh
bin/submit-ios.sh
```

# Ngrok

```sh
ngrok http 3001
```

# Internal build

```sh
eas build --profile preview --platform ios
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
- [ ] Push notification when a friend is online
  - [ ] Handle how this is shown in the settings page
- [ ] Have the PhoneInput component autosuggest the user's phone number. Note: This may require forking the library and adding the feature

## Phase 3: Before making it public

- [ ] Style the whole app to match the design in Figma
- [ ] Add idea of "friends" and "friend requests", rather than having all users be friends with each other
- [ ] Make friend search actually work
- [ ] Protect all endpoints with authentication the same way `protected-endpoint` is protected

## Phase 4: Low priority

- [ ] Fix the screen flicker that happens at login. I think it's an issue of not using a proper navigation library. It may not be an issue if we simply stick with a white background, it might just be an issue while we have a black background
- [ ] Store the whole user in the global state and fetch that rather than doing this messy thing of finding the user in the list of friends. More details in `Home.js`
- [ ] Make the light/dark mode setting item into a pretty toggle element, rather than just clickable text
