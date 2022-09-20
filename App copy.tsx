import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import { TriggerAPI } from "./screen/api/trigger.api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [res, setRes] = useState<any>();

  //post token to /token
  
const fetchData = async (token: string) => {
  const res1 = await fetch("http://192.168.1.160:3001/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify ({token}),
  })
 
  const responseJson = await res1.json();

 setRes(responseJson)
 setIsLoading(false)
  
}


 useEffect( () => {
    registerForPushNotificationsAsync().then( (token) => {

      fetchData(token);

      setExpoPushToken(token);
    });


    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("response another one", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


 if(isLoading) {
  return<View
  style={{
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  }}
>
  <Text>Loading...</Text>
  </View>
 }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text>Your expo push token app.js: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
        <Text>Response from nest: id: {res.id} </Text>
        <Text>Response from nest: token: {res.token} </Text>
       
        

      </View>
      {/* <Button
        title="Press to Send Token"
        onPress={async () => {
          await fetchData(expoPushToken);
        }}
      /> */}

<Button
        title="Press to Send Notification 2"
        onPress={async () => {
          await sendPushNotification(expoPushToken)
        }}
      />
    </View>
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Notification App.js:',
    body: 'this is body Expo: FrontEnd',
    data: { someData: 'Hi there' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

//get the token
//1. register for notificstion
async function registerForPushNotificationsAsync() {
  let token: string;

  if (Device.isDevice) {
    //2. asked for permission from that device
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      
      return;
    }
    //3. sassign particular behavior for device e.g.a custom ringtone,
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    //4. get Expo token
    token = (await Notifications.getExpoPushTokenAsync()).data;
   //console.log('token from at the end: ',token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
