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
The following tasks are not top priority right now, but we'll want to get to them eventually:
- [ ] Fix the screen flicker that happens at login. I think it's an issue of not using a proper navigation library. It may not be an issue if we simply stick with a white background, it might just be an issue while we have a black background
- [ ] Have the PhoneInput component autosuggest the user's phone number. Note: This may require forking the library and adding the feature
- [ ] Rename the repo from "ketchup-club" to "ketchup-club"
- [ ] Style the whole app to match the design in Figma