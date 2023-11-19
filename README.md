## Development

```sh
yarn start
```

## Internal build

```sh
eas build --profile preview --platform ios
```

```sh
eas build --profile preview --platform all
```

## TODOs
#### Phase 1: Basic functionality
- [ ] Check in the background if a friend is online, and if so send a push notification to the user

#### Phase 2: Before friends use it
- [ ] Have the PhoneInput component autosuggest the user's phone number. Note: This may require forking the library and adding the feature

#### Phase 3: Before making it public
- [ ] Protect all endpoints with authentication the same way `protected-endpoint` is protected

#### Phase 4: Low priority
- [ ] Fix the screen flicker that happens at login. I think it's an issue of not using a proper navigation library. It may not be an issue if we simply stick with a white background, it might just be an issue while we have a black background
- [ ] Style the whole app to match the design in Figma