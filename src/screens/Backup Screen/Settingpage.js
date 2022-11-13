import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity, KeyboardAvoidingView, RefreshControl
} from "react-native";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Footer from "../components/Footer";
import Headr1 from "../components/Headr1";
import Logout from "../components/Logout";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../components/Loader';

function Settingpage(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await getRefresh();
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

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        await setLoading(false);
      }
    }
  }

  const getLocalData = async () => {
    success = await formValidation.getLocalData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
        setLoadingFetch(false);
      }
    }
  }

  const getRefresh = async () => {
    await getLoginData();

    await setLoading(false);
    await setLoadingFetch(false);
    return(true);
  }

  useEffect(() => {
    //getLoginData();
    getLocalData();
    //setLoading(false);
    //setLoadingFetch(false);

    return () => {
      setLoading(false);
    }
  },[]);

  //alert(props.route.name);

  return (
    !loading ?
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}>
      <View>
        <Headr1 style={styles.header1} dataLogin={dataLogin} thumbProfile={dataLogin.thumbProfile} />
      </View>
      <Spinner
                  visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#236CFF"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
      <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
        <View style={styles.container}>
          <View style={styles.scrollAreaStack}>
            <View style={styles.scrollArea}>
              
                <View style={styles.group4}>
                  <View style={styles.label1}>
                    <View style={styles.iconRow}>
                      <SimpleLineIconsIcon
                        name="settings"
                        style={styles.icon}
                      ></SimpleLineIconsIcon>
                      <Text style={styles.pengaturan}>Pengaturan</Text>
                    </View>
                  </View>
                  <View style={styles.group2}>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate("profileScreen", { base_url: props.route.params.base_url, onRefresh: onRefresh, dataLogin: dataLogin, onGoBack: () => onRefresh() })}
                      style={styles.button}
                    >
                      <View
                        gradientImage="Gradient_BThsF2K.png"
                        style={styles.rect}
                      >
                        <Text style={styles.submenu}>Data Pribadi</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate("profesiScreen", { base_url: props.route.params.base_url, dataLogin: dataLogin })}
                      style={styles.button}
                    >
                      <View style={styles.rect}>
                        <Text style={styles.submenu}>Data Profesi</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate("layananScreen", { base_url: props.route.params.base_url, dataLogin: dataLogin })}
                      style={styles.button}
                    >
                      <View style={styles.rect}>
                        <Text style={styles.submenu}>Atur Layanan</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate("jadwalScreen", { base_url: props.route.params.base_url, dataLogin: dataLogin })}
                      style={styles.button}
                    >
                      <View style={styles.rect}>
                        <Text style={styles.submenu}>Atur Jadwal Reservasi</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.group4, {marginTop: '5%'}]}>
                  <View style={styles.label1}>
                    <View style={styles.iconRow}>
                      <IoniconsIcon
                        name="md-help-circle-outline"
                        style={styles.icon}
                      ></IoniconsIcon>
                      <Text style={styles.pengaturan}>Bantuan</Text>
                    </View>
                  </View>
                  <Text style={styles.customerService}>
                    Hubungi Customer Service
                  </Text>
                  <Text style={styles.kontakWhatsapp}>Kontak Whatsapp</Text>
                  <Text style={styles.termConditions}>
                    Syarat dan Ketentuan Platform
                  </Text>
                  <Text style={styles.tentangVissitIn}>Tentang Vissit.in</Text>
                  <Logout style={styles.logout} props={props} dataLogin={dataLogin} setLoadingFetch={setLoadingFetch}></Logout>
                </View>
              
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <Footer style={styles.footer1} props={props} dataLogin={dataLogin} />
      </View>
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
  scrollArea: {
    top: 0,
    left: 22,
    height: 'auto',
    right: 0,
    left:0,
    padding: 10
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  group4: {

  },
  label1: {
    flexDirection: "row",
    flex: 1
  },
  icon: {
    color: "#41aadf",
    fontSize: 30
  },
  pengaturan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginLeft: 3,
    //marginTop: 8,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  iconRow: {
    flexDirection: "row",
    flex: 1,
    padding: '2%'
  },
  group2: {
    height: 213,
    justifyContent: "space-between",
    marginTop: 6,
    marginLeft: 35
  },
  button: {
    height: 49,
    alignSelf: "stretch"
  },
  rect: {
    padding: '4%',
    borderRadius: 10,
    backgroundColor: "rgba(65,170,223,1)"
  },
  submenu: {
    color: "rgba(255,255,255,1)"
  },
  customerService: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 29
  },
  kontakWhatsapp: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 7,
    marginLeft: 29
  },
  termConditions: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 9,
    marginLeft: 29
  },
  tentangVissitIn: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 7,
    marginLeft: 29
  },
  scrollAreaStack: {
    height: 'auto',
    marginTop: 0,
    flex: 1
  },
  header1: {

  }
});

export default Settingpage;
