import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity, KeyboardAvoidingView,
  Linking
} from 'react-native';
import IconDasi from 'react-native-vector-icons/MaterialCommunityIcons';
import IconPanah from 'react-native-vector-icons/Ionicons';
import IconEdit from 'react-native-vector-icons/FontAwesome5';
import IconInfo from 'react-native-vector-icons/Entypo';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../../components/Loader';
import { CommonActions } from '@react-navigation/native';
import {Header} from '../../components';

export default function Setting(props) {
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
    success = await formValidation.getCurrentLoginData();

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

  const logout = async() => {
    //alert(JSON.stringify(props));
    setLoadingFetch(true);
    let params = [];
    params.push({ base_url: formValidation.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.logout(params);
    
    if(success.status === true) {
      await AsyncStorage.clear();
      try {
        const value = await AsyncStorage.getItem('loginStateNakes')
        if(!value) {
          props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'loginScreen',
                    //params: { base_url: base_url },
                  }
                ],
              })
            )
        }
      } catch(e) {
        // error reading value
        alert(e);
      }
    }
    
    //props.navigation.navigate('loginScreen');
  }

  const openPayment = async() => {
    formValidation.showError('Fitur ini belum tersedia !!!');
    //props.navigation.navigate('InfoRekening', { base_url: formValidation.base_url } );
  }

  function openLink(link) {
    Linking.openURL(link);
  }

  //console.log(props);
  const Icons = ({label, name, color}) => {
    if (label === 'panahKanan') {
      return <IconPanah style={styles.Iconarrow(color)} name={name} />;
    }
    if (label === 'Edit') {
      return <IconEdit style={styles.Iconarrow(color)} name={name} />;
    }
    if (label == 'dasi') {
      return <IconDasi style={styles.Iconarrow(color)} name={name} />;
    }
    if (label == 'info') {
      return <IconInfo style={styles.Iconarrow(color)} name={name} />;
    }
  };

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.Beranda}
        onLayout={event => setLayout(event.nativeEvent.layout)}>
        {dataLogin ?
          <Header name="setting" props={props} dataLogin={dataLogin} thumbProfile={dataLogin.thumbProfile}/>
          :
          <View style={styles.User} />
        }
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal={false}
          contentContainerStyle={styles.scrollArea_contentContainerStyle}
        >
          <View style={styles.Group928}>

            <View style={styles.Akunku_section}>
              <Text style={styles.Txt1027}>Akunku</Text>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => props.navigation.navigate('profileScreen', { base_url: formValidation.base_url, onRefresh: onRefresh, dataLogin: dataLogin, onGoBack: () => onRefresh() })}>
                <Icons label="panahKanan" name="happy-outline" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Atur Profil Saya</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => props.navigation.navigate('profesiScreen', {dataLogin: dataLogin})}>
                <Icons label="panahKanan" name="briefcase-sharp" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Atur Data Profesi Saya</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => props.navigation.navigate('layananScreen', {dataLogin: dataLogin})}>
                <Icons label="panahKanan" name="trash-bin-sharp" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Pengaturan Layanan</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => props.navigation.navigate('jadwalScreen', {dataLogin: dataLogin})}>
                <Icons label="panahKanan" name="time-sharp" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Pengaturan Jadwal</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => props.navigation.navigate('InformasiRekening', {dataLogin: dataLogin})}>
                <Icons label="panahKanan" name="flash" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Informasi Rekening</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => props.navigation.navigate('GantiSandi')}>
                <Icons label="Edit" name="unlock-alt" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Ganti Sandi</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={openPayment}>
                <Icons label="panahKanan" name="notifications" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Notifikasi</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.Akunku_section}>
              <Text style={styles.Txt1027}>Informasi Lainnya</Text>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => openLink('https://vissit.in/kebijakanprivasi')}>
                <Icons label="dasi" name="shield-account-outline" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Kebijakan Privasi</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => openLink('https://vissit.in/syarat&ketentuan')}>
                <Icons label="info" name="info" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Ketentuan Layanan Platform</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => openLink('https://vissit.in/#contact')}>
                <Icons label="Edit" name="envelope" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Hubungi Layanan Bantuan</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.Akunku_subSection}
                onPress={() => openLink('https://vissit.in/tentang_kami')}>
                <Icons label="dasi" name="tie" />
                <View style={styles.Akunku_subSection_icon}>
                  <Text style={styles.Txt656}>Tentang kami</Text>
                  <Icons label="panahKanan" name="chevron-forward-outline" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={logout}>
            <View style={styles.Btn_lanjut}>
              <Text style={styles.Txt597}>KELUAR</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.Txt577}>Ver. 1.0.1+11</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Beranda: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: '2%',
    width: '100%',
  },
  scrollArea_contentContainerStyle: {
    // flex: 1,
    height: 'auto',
  },

  User: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '10%',
  },
  Useravatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 100,
  },
  Text: {
    display: 'flex',
    flexDirection: 'column',
  },
  Txt241: {
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,32,51,0.6)',
    marginBottom: 4,
  },
  Txt576: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,32,51,0.6)',
  },

  Group928: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '5%',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Iconarrow: color => ({
    backgroundColor: 'transparent',
    color: color ? color : 'rgba(0,0,0,1)',
    fontSize: 14,
    opacity: 0.8,
  }),

  Akunku_section: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 20
  },

  Akunku_subSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '5%',
  },
  Akunku_subSection_icon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  Txt656: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(79,92,99,1)',
  },
  Txt597: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
  },
  Txt1027: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    marginBottom: 10,
  },
  Btn_lanjut: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingVertical: '2%',
    marginBottom: 10,
    marginHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Txt577: {
    textAlign: 'center',
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
  },
  wrapperKembali: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
});
