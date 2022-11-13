import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Ellipse } from "react-native-svg";
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';
import Loader from '../../components/Loader';

export default function Pesan(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

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
    success = await formValidation.getCurrentLoginData();

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
    getLoginData();
    // setDataLogin(formValidation.dataLogin);
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
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    // success = await formValidation.getAllChat(params, page, 10);
    success = await formValidation.getAllChat(params);
    
    if(success.status === true) {
      //await setDataChat(success.res);
      try {
        setShouldFetch(false);
        if(success.res !== undefined) {
          // setDataChat(oldData => [...oldData, ...success.res]);
          setDataChat(success.res);

          // setPage(page + 1);
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
      base_url: formValidation.base_url,
      id_chat: id_chat,
      onRefresh: onRefresh,
      onGoBack: () => onRefresh()
    });
  }

  const IconImage = ({label, name}) => {
    return <Icon style={{color: 'rgba(255,255,255,1)', fontSize: 60, alignSelf: 'center'}} name={name} />;
  };

  function RenderPesan() {
    const newItems = dataChat;
    
    if(newItems) {
      return newItems.map((item, i) => {
        //(item.messages.length > 0 && newItems[i].messages[0].has_read === '0' && newItems[i].messages[0].id_sender !== dataLogin.id_nakes) || item.messages.length === 0 ? (formValidation.unreadMsg = true) : '';
        return (
          <TouchableOpacity
            key={item.id_chat}
            onPress={() => openChat(item.id_chat)}>
            <View style={styles.Chat_label}>
              {/*<Image
                style={styles.Rectangle2}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                }}
              />*/}
              <IconImage label="image" name="person-circle-outline" />
              <View style={styles.Blockpesan}>
                <Text style={styles.Txt011}>{item.first_name + ' ' + item.middle_name + ' ' + item.last_name}</Text>
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
                <Text style={[styles.Txt137, {fontSize: 10, fontStyle: 'italic'}]}>{item.messages.length > 0 ? moment(newItems[i].messages[0].timestamp, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY') : moment(item.date_created, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss DD-MM-YYYY')}</Text>
                <Text style={styles.Txt137}>
                  {item.messages.length > 0 ? newItems[i].messages[0].message : 'Anda sudah terhubung dengan Klien...'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={[styles.Chat_label, {backgroundColor: 'transparent'}]}>
          <View style={styles.Blockpesan}>
            <Text style={[styles.Txt681, {fontWeight: 'bold', color: 'rgba(0,0,0,1)'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
  };
  
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
          <SafeAreaView style={styles.container}>
            <View style={styles.Layanan_reservasi_pesan}>
              {/*<View style={styles.User}>
                <View style={styles.subUser}>
                  <Image
                    style={styles.Useravatar}
                    source={{
                      uri: 'http://placeimg.com/640/480/any',
                    }}
                  />
                  <View style={styles.Text}>
                    <Text style={styles.Txt2541}>Aldiory Xavian Shaquille</Text>
                    <View style={styles.subUser}>
                      <Text style={styles.Txt6811}>1234567891239545</Text>
                      <TouchableOpacity
                        onPress={() => {
                          copyKodeNakes('1234567891239545');
                        }}>
                        <Icons label="Panah" name="copy" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.Txt2541}>Pesan Masuk</Text>*/}

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
                <RenderPesan />
                {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
              </ScrollView>
            </View>
          </SafeAreaView>
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    // padding: '2%'
  },
  ellipse: {
    top: 3,
    width: 12,
    height: 12,
    position: "absolute",
    right: 0
  },

  Layanan_reservasi_pesan: {
    flex: 1,
    // paddingVertical: '2%',
    // paddingHorizontal: '2%',
    flexDirection: 'column',
    // marginHorizontal: 20,
  },

  Tab_pesan: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 6,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(218,218,218,1)',
  },
  Group316: item => ({
    paddingVertical: 7,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    borderRadius: 20,
    backgroundColor: item ? '#43A9DD' : 'rgba(217,217,217,1)',
  }),
  Txt6110: item => ({
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: item ? 'rgba(255, 255, 255, 1)' : 'rgba(79,92,99,1)',
    textAlign: 'center',
    justifyContent: 'center',
  }),

  Chat_label: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    padding: '2%',
    // borderRadius: 10,
    // backgroundColor: 'rgba(62, 62, 62, 1)',
    // marginBottom: 10,
    backgroundColor: '#43A9DD',
    borderBottomWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  Rectangle2: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 100,
  },
  Blockpesan: {
    marginLeft: '2%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  Txt011: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(250,250,250,1)',
    marginBottom: 4,
  },
  Txt137: {
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(250,250,250,1)',
    textAlign: 'justify',
    marginBottom: 4,
  },

  User: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subUser: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Useravatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 100,
  },
  
  Text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  Txt254: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 4,
  },
  Txt681: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    paddingRight: 25,
  },
  Txt2541: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    marginBottom: 4,
  },
  Txt6811: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,32,51,1)',
    paddingRight: 25,
  },
});
