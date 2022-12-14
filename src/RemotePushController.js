import React, { useEffect, useContext } from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { form_validation } from "./form_validation";

const RemotePushController = ({props, onRefresh}) => {
  const formValidation = useContext(form_validation);

  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      /*onRegister: function(token) {
        console.log('TOKEN:', token)
      },*/
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification)

        PushNotification.setApplicationIconBadgeNumber(0);

        //alert(JSON.stringify(notification));
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
          if(notification.data.screen !== undefined) {
            if(notification.data.screen === 'bookingTrx') {
              props.navigation.navigate(notification.data.screen, { base_url: formValidation.base_url, id_jadwal: notification.data.id_jadwal, dataReservasi: JSON.parse(notification.data.dataReservasi) } );
            }else if(notification.data.screen === 'chatPage') {
              //getPesan(true); //setMessage = true, agar perintah onRefresh pada form Listchat dieksekusi saat ada pesan masuk via Notif
              // onRefresh();
              props.navigation.navigate(notification.data.screen, { base_url: formValidation.base_url, id_chat: notification.data.id_chat } );
            }
          }
        } else {
          //handleNotification(notification)
          if(notification.data.screen !== undefined) {
            if(notification.data.screen === 'bookingTrx') {
              if(notification.userInteraction === true) {
                props.navigation.navigate(notification.data.screen, { base_url: formValidation.base_url, id_jadwal: notification.data.id_jadwal, dataReservasi: JSON.parse(notification.data.dataReservasi) } );
              }
            }else if(notification.data.screen === 'chatPage') {
              //getPesan(true); //setMessage = true, agar perintah onRefresh pada form Listchat dieksekusi saat ada pesan masuk via Notif
              // onRefresh();
              if(notification.userInteraction === true) {
                props.navigation.navigate(notification.data.screen, { base_url: formValidation.base_url, id_chat: notification.data.id_chat } );
              }
            }
          }
        }
        // process the notification here

        // (required) Called when a remote is received or opened, or local notification is opened
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only: GCM or FCM Sender ID
      senderID: '877862471836',
      popInitialNotification: true,
      requestPermissions: true
    });

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });
  }, [])
return null
}
export default RemotePushController
