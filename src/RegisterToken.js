import React, { useEffect } from 'react';
import PushNotification, {Importance} from 'react-native-push-notification';

const RegisterToken = () => {
  useEffect(() => {
    PushNotification.configure({
      onRegister: function(token) {
        //console.log('TOKEN:', token)
      },
    })
  }, [])
return null
}

export default RegisterToken;