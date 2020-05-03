# How to start the project:

You'll need either a physical or virtual device. I (Matus) am using a physical Android device.
Others please update if there are any differences. 

1) Pull the repo
1) npm install
1) run `npm start` in one terminal
1) run `react-native run-android` in another (alternatively `run-ios`)

If your device is plugged in, this should push the app to the device and start the debugging.
The debugging will start showing in the window you ran `npm start` 

## Troubleshooting:

### No server requests work 
Is your server running? Do you have the right `baseUrl` set in `axiosConfig.js`? Is your device able to access 
that destination i.e. are you on the same network (LAN)

### I get errors with react-native <lib> but I haven't touched anything. 

React native libraries tend to be stupid. So, double check if this is not a genuine bug in our code.
If it doesn't seem like it, there is a chance that some caching is broken. In such a case run this:
` del %appdata%\Temp\react-native-* & cd android & gradlew clean & cd .. & del node_modules/ & npm cache clean --force & npm install & npm start -- --reset-cache
`
This works on windows. It might complain about some dir's non existent or something similar, I personally chose to ignore that,
as this is copied from the webs :) but it does the job. 

### react-native is not a recognised comand

Yep, this happens to me if I run the `react-native run-android` command outside of Intelij.
To be honest, I never bothered chasing this further. Soooo, good luck and please let us know :) 

# How to start developing

AFter you have pulled and got the app runing, you can start developing. Create your own branch,
and find a TODO in the code (either by using Intelij's built in option or a search of the repo)

AFter you've done your job, Merge Request into master and assign to someone to approve.