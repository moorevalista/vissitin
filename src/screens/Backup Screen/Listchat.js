import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text, RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Footer from "../components/Footer";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import Headr1 from "../components/Headr1";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';
import RemotePushController from '../RemotePushController';

function Listchat(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [thumbProfile, setThumbProfile] = useState('');
  const [dataChat, setDataChat] = useState('');

  //for realtime message check
  const [paramsCheck, setParamsCheck] = useState(''); //to footer-event

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  //params for pagination

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await getAllChat();
    //alert(success);
    if(success) {
      setRefreshing(false)
      setLoadingFetch(false);
    }else {
      setRefreshing(true);
      setLoadingFetch(true);
    }
    //wait(2000).then(() => setRefreshing(false));
  });

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
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);
    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    setLoading(true);
    if(dataLogin) {
      setCurrentDataNakes();
      //setDataParamsCheck();
    }
    return () => {
      setLoading(false);
    }
  },[dataLogin]);

  const setCurrentDataNakes = async () => {
    if(dataLogin.thumbProfile !== '') {
      await setThumbProfile(dataLogin.thumbProfile);
    }
    await getAllChat();
    
    await setLoading(false);
  }

  /*const setDataParamsCheck = () => {
    let data = [];
    data.push({
      onRefresh: onRefresh //kirim ke Event agar dieksekusi saat ada pesan masuk via notif
    });
    setParamsCheck(data);
    //alert(JSON.stringify(data));
  }*/

  const getAllChat = async () => {
    setShouldFetch(true);
    formValidation.getMsg = true;

    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getAllChat(params, page, 10);
    
    if(success.status === true) {
      //await setDataChat(success.res);
      try {
        setShouldFetch(false);
        if(success.res !== undefined) {
          setDataChat(oldData => [...oldData, ...success.res]);

          setPage(page + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    formValidation.getMsg = false;
    return true;
  }

  async function openChat(id_chat) {
    props.navigation.navigate('chatPage', {
      base_url: props.route.params.base_url,
      id_chat: id_chat,
      onRefresh: onRefresh,
      onGoBack: () => onRefresh()
    });
  }

  function RenderPesan() {
    const newItems = dataChat;
    
    if(newItems) {
      return newItems.map((item, i) => {
        //(item.messages.length > 0 && newItems[i].messages[0].has_read === '0' && newItems[i].messages[0].id_sender !== dataLogin.id_nakes) || item.messages.length === 0 ? (formValidation.unreadMsg = true) : '';
        return (
          <TouchableOpacity
            key={item.id_chat}
            onPress={() => openChat(item.id_chat)}
            style={styles.button}
          >
            <View style={styles.rect}>
                      <View style={styles.labelBox}>
                        <Text style={[styles.label, {fontWeight: 'bold', fontSize: 14, marginBottom: '2%'}]}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
                        {(item.messages.length > 0 && newItems[i].messages[0].has_read === '0' && newItems[i].messages[0].id_sender !== dataLogin.id_nakes) || item.messages.length === 0 ?
                          <Svg viewBox="0 0 12.29 12.29" style={styles.ellipse}>
                            <Ellipse
                              strokeWidth={0}
                              fill="rgba(251,27,1,1)"
                              cx={6}
                              cy={6}
                              rx={6}
                              ry={6}
                            ></Ellipse>
                          </Svg>
                          :
                          <></>
                        }
                        <Text style={[styles.label, {fontSize: 14}]}>{item.messages.length > 0 ? newItems[i].messages[0].message : 'Anda sudah terhubung dengan Klien...'}</Text>
                        <Text style={[styles.label, {fontStyle: 'italic'}]}>{item.messages.length > 0 ? moment(newItems[i].messages[0].timestamp, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY') : moment(item.date_created, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY')}</Text>
                      </View>
                    </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.rect}>
          <View style={styles.labelBox}>
            <Text style={[styles.label, {fontWeight: 'bold', fontSize: 14}]}>Tidak ada pesan</Text>
          </View>
        </View>
      )
    }
  }

  return (
    !loading ?
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
            <View>
              <Headr1
                style={styles.header1}
                dataLogin={dataLogin}
                name="Profile"
                thumbProfile={thumbProfile}
              />
            </View>
            <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    onScrollEndDrag={getAllChat}
                    /*refreshControl={
                        <RefreshControl
                          refreshing={false}
                          onRefresh={onRefresh}
                        />
                      }*/
                  >
              <View style={styles.container}>
                <View style={styles.labelchatlist}>
                  <View style={styles.icon1Row}>
                    <Icon name="ios-chatbubbles" style={styles.icon1}></Icon>
                    <Text style={styles.pesanMasuk}>Pesan Masuk</Text>
                  </View>
                </View>
                
                <View style={styles.scrollArea}>
                  <RenderPesan />
                  {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                </View>
                
              </View>
            </ScrollView>
            <View>
              <Footer style={styles.footer1} props={props} paramsCheck={paramsCheck} dataLogin={dataLogin} />
            </View>
            <RemotePushController props={props} onRefresh={onRefresh} />
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    flex: 1,
    paddingBottom: '25%',
    backgroundColor: "white"
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  scrollArea: {
    flex: 1,
    padding: '2%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    padding: '2%'
  },
  header1: {
    height: 164,
    marginTop: 0
  },
  footer: {
    position: "absolute",
    left: 0,
    height: 91,
    right: 0,
    bottom: 0
  },
  labelchatlist: {
    padding: '2%',
    flexDirection: "row"
  },
  icon1: {
    color: "#41aadf",
    fontSize: 30
  },
  pesanMasuk: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginLeft: '2%',
    alignSelf: 'center'
  },
  icon1Row: {
    height: 33,
    flexDirection: "row",
    flex: 1,
    marginRight: 4
  },  
  button: {
    marginBottom: '2%'
  },
  rect: {
    borderRadius: 15,
    backgroundColor: "rgba(74,74,74,0.1)"
  },
  ellipse: {
    top: 3,
    width: 12,
    height: 12,
    position: "absolute",
    right: 0
  },
  labelBox: {
    flex: 1,
    padding: '2%',
    fontWeight: 'bold'
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12
  }  
});

export default Listchat;
