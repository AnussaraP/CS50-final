import { registerForPushNotificationsAsync } from "../notifications";
import { TriggerDTO } from "../triggerDTO";
import React, {useEffect, useState } from 'react';
import { View, Button } from "react-native";

export const TriggerAPI = () => {

  let [triggerMessage, setTriggerMessage] = useState(null)


  
  useEffect(() => {
    
  },[])


 
    const sendPushNotification = async () => {
      const res1 = await fetch("http://192.168.1.160:3001/trigger", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify ({}),
      })
      const responseJson = await res1.json();
      //setRes(responseJson);
      
    }
  





  return (
<View>

    <Button
        title="Press to Send Notification 2"
        onPress={async () => {
          await sendPushNotification()
        }}/>

    </View>
  );
}



 // export const TriggerAPI = () => {
  //   const fetchData = async (token: string) => {
  //     const res1 = await fetch("http://192.168.1.160:3001/trigger", {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Accept-encoding": "gzip, deflate",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify ({token}),
  //     })
  //     const responseJson = await res1.json();
  //     setRes(responseJson);
      
  //   }
  // }



  // async function sendPushNotification(expoPushToken) {
  //   const message = {
  //     to: expoPushToken,
  //     sound: 'default',
  //     title: 'Notification App.js',
  //     body: 'this is body Expo',
  //     data: { someData: 'Hi there' },
  //   };
  
  //   await fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Accept-encoding': 'gzip, deflate',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(message),
  //   });
  // }