import React, { useState, useEffect, useRef, useContext } from "react";
import useChat from "./features/useChat";
import { form_validation } from "./form_validation";

const Listener = (props) => {
  const formValidation = useContext(form_validation);

  const roomId = props.id_listener;
  const {messages, sendMessage} = useChat(roomId); //func kirim pesan pada useChat
  const setWaiting = props.setWaiting;
  const [newMessage, setNewMessage] = useState('');

  //params from sender
  const id_jadwal = props.id_jadwal;
  const id_paket = props.id_paket;
  const id_detail = props.id_detail;
  const reqCheckin = props.reqCheckin;
  const checkTiming = props.checkTiming;
  const goCheckIn = props.goCheckIn;
  const reqCheckout = props.reqCheckout;
  const currentState = props.currentState;

  //console.log(reqCheckin);
  //console.log(currentState);

  //func for notif
  //const notifReservasi = props.notifReservasi;

  //for payment
  const successPayment = props.successPayment;
  const updatePayment = props.updatePayment;

  //for realtime message check
  //const getAllChat = props.getAllChat;
  //const getMessage = props.getMessage;
  //const getPesan = props.getPesan;

  //sending check in request to pasien
  useEffect(() => {
    //console.log(roomId);
    // console.log(reqCheckin);
    (reqCheckin && currentState !== 'ONSITE') ? handleCheckin() : '';

    // (reqCheckin && currentState === 'ONSITE') ? byPassCheckin() : ''; //untuk bypass checkin tanpa menunggu konfirmasi pasien
  }, [reqCheckin]);

  //sending check out request to pasien
  useEffect(() => {
    reqCheckout ? handleCheckout() : '';
  }, [reqCheckout]);

  //listen for check in respon from pasien
  useEffect(() => {
    //console.log(messages);
    handleConfirm()
  }, [messages]);

  useEffect(() => {
    if(currentState === 'ONSITE' && reqCheckin) {
      //console.log('uye ' + currentState);
      handleOnSite();
    }
  }, [currentState]);

  //for realtime message check
  /*useEffect(() => {
    getMessage ? handleCheckMsg() : '';
  }, [getMessage]);*/


  const handleSendMessage = (key) => {
    sendMessage(key);
    //console.log(key);
  }

  const handleOnSite = async () => {
    //alert('cs-' + currentState);
    await handleSendMessage('onsite|' + id_jadwal + '|' + id_paket + '|' + id_detail);
  }

  const handleCheckin = async () => {
    //alert('ci-' + reqCheckin);
    await handleSendMessage('checkin|' + id_jadwal + '|' + id_paket + '|' + id_detail);
    await byPassCheckin();
  }

  const handleCheckout = async () => {
    //alert('co-' + reqCheckout);
    //console.log('co-' + reqCheckout);
    await handleSendMessage('checkout|' + id_jadwal + '|' + id_paket + '|' + id_detail);
  }

  const byPassCheckin = async () => { //untuk bypass checkin tanpa menunggu konfirmasi pasien
    let params = [];
    params['id_jadwal'] = id_jadwal;
    params['id_paket'] = id_paket;
    params['id_detail'] = id_detail;
    goCheckIn(params);
  }

  const handleConfirm = async () => {
    let str = '';
    //let i = 0;

    //for (i = 0; i < messages.length; i++) {
      (messages.length > 0) ? str = messages[messages.length -1].body : '';
      const data = str.split('|');
      const type = data[0];
      const value = data[1];
      let params = [];
      params['id_jadwal'] = data[2];
      params['id_paket'] = data[3];
      params['id_detail'] = data[4];

      if(type !== undefined && value !== undefined) {
        if(type === 'checkin' && value !== 'allow') { //saat nakes request checkin
          setWaiting(type, value); //send response ke dashboard nakes untuk masuk ke state menunggu
        }else if(type === 'checkin' && value === 'allow') { //saat terima response dari pasien untuk konfirmasi checkin nakes
          goCheckIn(params); //send response ke dashboard nakes untuk masuk ke state checkin
        }else if(type === 'Payment' && value === 'DONE') {
          updatePayment(value);
        }/*else if(type === 'notif' && value === 'reservasi') {
          notifReservasi(type, value, params);
        }*/
      }
    //}
  }

  /*const handleCheckMsg = async () => {
    await getAllChat();
    await getPesan(false);
  }*/

  return (
    <></>
  )

}

export default Listener;