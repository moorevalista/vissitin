import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput, BackHandler,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Loader from '../components/Loader';
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import moment from 'moment-timezone';
import 'moment/locale/id';
import useChat from '../features/useChat';
import ChatRoom from '../features/ChatRoom/ChatRoomUser';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function Chatpage(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //params dari page sebelumnya
  const [id_chat, setId_chat] = useState('');

  const [detailChat, setDetailChat] = useState([]);
  const [terkirim, setTerkirim] = useState(false);
  const [prevChat, setPrevChat] = useState([]);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        //await setLoading(false);
      }
    }
  }

  useEffect(() => {
    getLoginData();
    return () => {
      setLoading(false);
    }
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }
  },[dataLogin]);

  useEffect(() => {
    if(detailChat.messages) {
      renderMessages();
    }
  },[detailChat]);

  useEffect(() => {
    if(prevChat.length > 0) {
      readChat();
    }
  }, [prevChat]);

  function handleBackButtonClick() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
    const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
      if(props.route.params.onRefresh !== undefined) {
        props.route.params.onRefresh();
      }
    });

    return () => {
      unsubscribe;
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [props.navigation]);

  const setDataSource = async () => {
    await setId_chat(props.route.params.id_chat);
    await getDetailChat(props.route.params.id_chat);
    await setLoading(false);
  }

  const getDetailChat = async (id) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      id_chat: id,
      token: dataLogin.token
    });

    success = await formValidation.getDetailChat(params);

    if(success.status === true) {
      setDetailChat(success.res);
    }
  }

  const sendChat = async (msg) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_chat: id_chat,
      id_sender: dataLogin.id_nakes,
      messages: msg,
      token: dataLogin.token,
      id_pasien: detailChat.id_pasien,
      notif_type: 'notif_chat'
    });

    success = await formValidation.sendChat(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        return null;
      }else {
        //send notif
        await formValidation.sendNotif(params);

        return success.res.id_msg;
      }
    }
  }

  const saveMsgRef = async (id_msg, ref) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_chat: id_chat,
      id_msg: id_msg,
      id_sender: dataLogin.id_nakes,
      ref: ref,
      token: dataLogin.token
    });

    success = await formValidation.saveMsgRef(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        return false;
      }else {
        return true;
      }
    }
  }

  const readChat = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      prevChat: prevChat,
      id_sender: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.readChat(params);

    if(success.status === true) {
      if(success.res.responseCode !== '000') {
        return false;
      }else {
        return true;
      }
    }
  }

  async function renderMessages() {
    let chat = [];
      detailChat.messages.map((item, i) => {
      chat[i] = item;
    })
    await setPrevChat(chat);
  }

  return (
    !loading ?
    <View style={styles.containerKey}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <Spinner
                    visible={loadingSave}
                    textContent={''}
                    textStyle={styles.spinnerTextStyle}
                    color="#236CFF"
                    overlayColor="rgba(255, 255, 255, 0.5)"
                  />
              
                
                  <View style={styles.rectStack}>
                    <View style={styles.rect}></View>
                    <View style={styles.headchat}>
                      <View style={styles.rect3}>
                        <View style={styles.userchat1ColumnRow}>
                          <View style={styles.userchat1Column}>
                            <Text style={styles.userchat1}>{detailChat.first_name + ' ' + detailChat.middle_name + ' ' + detailChat.last_name}</Text>
                            <Text style={styles.layananFisioterapi}>{detailChat.online == 1 ? 'Online' : 'Offline'}</Text>
                          </View>
                          
                          <TouchableOpacity
                            onPress={() => {
                              props.route.params.onRefresh !== undefined ? props.route.params.onRefresh():''
                              props.navigation.goBack()
                            }}
                            style={styles.button}
                          >
                            <IoniconsIcon
                              name="ios-close-circle-outline"
                              style={styles.icon}
                            ></IoniconsIcon>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.container}>
                    <View style={styles.scrollArea}>
                      <ChatRoom
                        params={props.route.params}
                        id_pasien={detailChat.id_pasien}
                        prevChat={prevChat}
                        sendChat={sendChat}
                        saveMsgRef={saveMsgRef}
                      />
                    </View>
                  </View>
            </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white",
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0
  },
  rect: {
    top: 0,
    left: 0,
    height: '70%',
    position: "absolute",
    backgroundColor: "#41aadf",
    right: 0
  },
  headchat: {
    top: '45%',
    left: 25,
    height: '50%',
    position: "absolute",
    right: 24
  },
  rect3: {
    flex: 1,
    backgroundColor: "rgba(74,74,74,1)",
    borderRadius: 23
  },
  userchat1ColumnRow: {
    flex: 1,
    padding: '2%',
    flexDirection: "row"
  },
  userchat1Column: {
    flex: 0.85,
    padding: '2%',
  },
  userchat1: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 16
  },
  layananFisioterapi: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
  },
  button: {
    flex: 0.15,
    marginLeft: '2%',
    flexDirection: "row",
    alignSelf: 'center'
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 30
  },
  rectStack: {
    height: '20%'
  }
});

export default Chatpage;
