# How to start the project:

## Physical device 


**Android:** If you have android physical device, connect device with PC by USB and do the following steps:

1) execute `npm install`
1) run `npm start` in one terminal
1) run `react-native run-android` in another terminal

If your device is plugged in, this should push the app to the device and start the debugging.
The debugging will start showing in the window you ran `npm start` 

**iOS:** Haven't tried yet.

## Virtual Device
**Android:** 
If you want to develop or run this react-native app on AVD - Android Virtual Device - do the following steps (tested on Linux Ubuntu 20.04 LTS):
1) Do proper Android development setup. Follow steps [here](https://reactnative.dev/docs/environment-setup) in section  `React Native CLI Quickstart`
1) check whether `android/gradlew` is executable. If not, go gto `android` folder and execute `chmod 755 gradlew`
1) go to `android` folder, create `local.properties` file and add this line `sdk.dir = /home/USERNAME/Android/Sdk` where USERNAME is your linux username

Afterwards you need to run AVD manually (e.g. in Linux you will go to folder `/home/USERNAME/Android/Sdk/emulator` where Android sdk is
stored by default, execute `./emulator -list-avds` to check which AVDs you have installed and start one of them - in my case I execute 
`./emulator -avd Nexus_5_API_29`)

If your AVD is running (it is the same as you connect your physical device and PC with USB), do the same steps as in **Physical device** section

**iOS:** Haven't tried yet

## Tips
### Debugging 

The simplest way of debugging code is to use Chrome. You don’t need to install any other apps. 
On Android emulator, or shake real devices, you will see the in-app developer menu. Tap `Debug JS Remotely` or `Debug`. 
The Chrome debugger will be opened automatically. You still need to open Developer Tools in Chrome manually (by pressing Ctrl+Shift+J in Linux). 
Open source files in the Sources tab, you can set breakpoints here. More details [here](https://stackoverflow.com/a/55965037)

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
