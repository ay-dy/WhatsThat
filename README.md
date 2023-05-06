# WhatsThat?
This is the WhatsThat? app code for the 22/33 Mobile Applications Development Assignment (6G6Z1104). I have used the MDN Web Docs general, as well as JS-specific, code styling guidelines.

https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide

https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript

## Running the app
1. Clone the repository into a directory on your local machine. If you have Git installed on your machine then you can run "git clone https://github.com/ay-dy/whatsthat" in your terminal.

2. In the terminal, navigate to the directory where you have cloned the repository and run `npm install` to install the dependencies.

3. Run the server with `npm run dev`.

4. Run the app with `npm start` followed by `w` to open it on web.

## Side notes
Refer to the screencast to grasp how each part of the app works and how it refers to the 23 API endpoints.
I have used some third-party components throughout the app to improve its esthetics and save some time, but not to the point where it would be classed as a cop-out from putting in actual hard work.

### Spinner overlay
- source: https://github.com/ladjs/react-native-loading-spinner-overlay

- I used this component in places where an API call was required. It covers the entire screen with a loading animation to prevent the user from making more calls before the previous ones were finished executing. I chose it because it looks better than displaying a simple Text component with a static "Loading..." text.

### Material menu
- source: https://github.com/mxck/react-native-material-menu

- I used this component in 3 places. The main screen to either navigate to the user settings screen or to log out, the chat settings screen button to remove a user from the chat, and chat screen to edit or delete a message. I chose it because it's the closest I can get to mimick WhatsApp's functionality in those places.