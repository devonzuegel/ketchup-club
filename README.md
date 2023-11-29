# Development

```sh
yarn start
```

# TestFlight build

```sh
bin/build-ios.sh
bin/submit-ios.sh
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
- [ ] Scroll the list of friends so it doesn't overflow the screen

## Phase 2: Before friends use it
- [ ] Publish to TestFlight so other friends can use it
- [ ] Push notification when a friend is online
- [ ] Have the PhoneInput component autosuggest the user's phone number. Note: This may require forking the library and adding the feature

## Phase 3: Before making it public
- [ ] Protect all endpoints with authentication the same way `protected-endpoint` is protected
- [ ] Store the whole user in the global state and fetch that rather than doing this messy thing of finding the user in the list of friends. More details in `Home.js`

## Phase 4: Low priority
- [ ] Fix the screen flicker that happens at login. I think it's an issue of not using a proper navigation library. It may not be an issue if we simply stick with a white background, it might just be an issue while we have a black background
- [ ] Style the whole app to match the design in Figma