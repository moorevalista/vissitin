import React, { Component, useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Svg, { Ellipse } from "react-native-svg";
import { CommonActions } from '@react-navigation/native';

import { form_validation } from "./form_validation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Listener from './listener';
//import LocalNotification from './LocalPushController';
//import Notifications from './Notifications';

function Event({ props, paramsCheck = null, setUnreadMsg = false }) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);

  //for checkin
  const [id_jadwal, setId_jadwal] = useState('');
  const [id_paket, setId_paket] = useState('');
  const [id_detail, setId_detail] = useState('');
  const [id_listener, setId_listener] = useState('');
  const [reqCheckin, setReqCheckin] = useState(false);
  const [reqCheckout, setReqCheckout] = useState(false);
  const [currentState, setCurrentState] = useState('');
  //for checkin

  //for payment
  const [successPayment, setSuccessPayment] = useState(false);

  //for chat
  //const [dataChat, setDataChat] = useState('');

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  useEffect(() => {
    setLoading(true)
    if(loading) {
      getLoginData();
    }

    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      getUnreadChat();
    }
    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin, formValidation.getMsg]);

  useEffect(() => {
    if(paramsCheck !== null && paramsCheck !== '') {
      setDataSource();
    }
  },[paramsCheck]);

  const setDataSource = async () => {
    if(paramsCheck !== null) {
      setId_jadwal(paramsCheck[0].id_jadwal);
      setId_paket(paramsCheck[0].id_paket);
      setId_detail(paramsCheck[0].id_detail);
      setId_listener(paramsCheck[0].id_listener);
      setReqCheckin(paramsCheck[0].reqCheckin);
      setReqCheckout(paramsCheck[0].reqCheckout);
      setCurrentState(paramsCheck[0].currentState);
      setSuccessPayment(paramsCheck[0].successPayment);
    }
  }

  //for chat
  const getUnreadChat = async () => {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getUnreadChat(params);
    
    if(success.status === true) {
      //await setDataChat(success.res);
      const newItems = success.res;

      if(newItems) {
        let unreadMsgCount = 0;
        //formValidation.unreadMsgCount = 0;
        return newItems.map((item, i) => {
          (item.messages.length > 0 && newItems[i].messages[0].has_read === '0' && newItems[i].messages[0].id_sender !== dataLogin.id_nakes) ? unreadMsgCount++ : unreadMsgCount;
          formValidation.unreadMsgCount = unreadMsgCount;
          //console.log(unreadMsgCount);
          //console.log(formValidation.unreadMsgCount);
          formValidation.unreadMsgCount > 0 ? formValidation.unreadMsg = true : formValidation.unreadMsg = false;
          //console.log(formValidation.unreadMsg);
          setUnreadMsg(formValidation.unreadMsg);
        })
      }
    }
    return true;
  }

  const SetWaiting = async () => {
    if(paramsCheck !== null) {
      paramsCheck[0].setWaiting();
    }
  }

  const GoCheckIn = async () => {
    if(paramsCheck !== null) {
      paramsCheck[0].goCheckIn();
    }
  }

  const CheckTiming = async () => {
    if(paramsCheck !== null) {
      paramsCheck[0].checkTiming();
    }
  }

  const UpdatePayment = async (value) => {
    if(paramsCheck !== null && paramsCheck[0].updatePayment !== undefined) {
      paramsCheck[0].updatePayment(value);
    }
  }

  /*const GetAllChat = async () => {
    if(paramsCheck !== null) {
      paramsCheck[0].onRefresh(); //dari form Listchat, untuk refresh data Pesan saat ada pesan masuk via notif
    }
  }*/

/*  const NotifReservasi = async (type, value, res) => {
    success = await getReservation();

    let params = [];
    params.push({
      message: 'Ada reservasi baru untuk anda. ',
      screen: 'bookingTrx',
      data: success,
      id: res['id_jadwal']
    });
    Notifications.localNotification('default', params);
    //localNotification.deleteChannel('123456');
  }

  async function getReservation() {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getReservation(params);

    if(success.status === true) {
      return(success.res);
    }
  }*/

  return (
    <View>
      <Listener
        base_url={formValidation.base_url}
        setWaiting={SetWaiting}
        goCheckIn={GoCheckIn}
        id_jadwal={id_jadwal}
        id_paket={id_paket}
        id_detail={id_detail}
        checkTiming={CheckTiming}
        reqCheckin={reqCheckin}
        reqCheckout={reqCheckout}
        id_listener={id_listener}
        currentState={currentState}
        successPayment={successPayment}
        updatePayment={UpdatePayment}
        //getMessage={getMessage} //for realtime check message
        //getAllChat={GetAllChat} //for realtime check message
        //getPesan={getPesan} //for realtime check message
//        notifReservasi={NotifReservasi} //notif reservasi
      />
    </View>
  );
}

export default Event;
