import React, { Component, useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView, SafeAreaView, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Linking
} from 'react-native';
import {IconVissitin} from '../../assets';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

import PushNotification, {Importance} from 'react-native-push-notification';

export default function Login(props) {
  const formValidation = useContext(form_validation);
  const base_url = formValidation.base_url;

  //const [loginState, setLoginState] = useState(false);
  const [nohp, setNohp] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  //let dataNakes = [];
  //let token = '';
  const [dataNakes, setDataNakes] = useState('');
  const [token, setToken] = useState('');

  const [deviceToken, setDeviceToken] = useState(null);

  const [relogin, setRelogin] = useState(false);
  const [otp, setOtp] = useState('');
  const [dataOTP, setDataOTP] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const [styleOTP, setstyleOTP] = useState(styles.textInput);
  const [styleBoxOTP, setstyleBoxOTP] = useState(styles.box_otp);
  const [buttonSubmit, setButtonSubmit] = useState(true);

  const setData = (key, value) => {
    switch(key) {
      case 'setNohp':
        setNohp(value);
        break;
      case 'setPassword':
        setPassword(value);
        break;
    }
  }

  useEffect(() => {
    showAlertBox();

    return () => {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loginCheck();

    return () => {
      setLoading(false);
    }
  }, []);

  //trigger cek OTP yg diinput user
  useEffect(() => {
    handleValidationOTP()
  }, [otp]);

  useEffect(() => {
    if(otpVerified) {
      onLoginSuccess();
    }

    return () => {
      setDeviceToken(deviceToken);
    }
  }, [otpVerified]);

  const registerToken = () => {
    PushNotification.configure({
      onRegister: async function(fcmToken) {
        console.log('TOKEN:', fcmToken);

        if(Platform.OS === 'ios') {
          let params = [];
          params.push({
            base_url: base_url,
            fcmToken: fcmToken['token']
          })
          success = await formValidation.convertToken(params);

          if(success.status === true) {
            //console.log(success.res.registration_token);
            await setDeviceToken(success.res.registration_token);
          }else {
            await setDeviceToken(null);
          }
        }else {
          await setDeviceToken(fcmToken['token']);
        }
      },
    })
    return () => {
      setDeviceToken(deviceToken);
    }
  }

  const loginCheck = async() => {
    try {
      const value = await AsyncStorage.getItem('loginStateNakes')
      if(value) {
        const token = await AsyncStorage.getItem('token');
        if(token !== null) {
          let params = [];
          params.push({
            base_url: base_url,
            token: token
          });

          success = await formValidation.checkToken(params);
          //console.log(success);

          if(success.status === true) {
            if(success.res.responseCode === '000') {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: 'MainApp',
                      params: { base_url: base_url },
                    }
                  ],
                })
              )
            }else {
              await AsyncStorage.clear();
              try {
                const value = await AsyncStorage.getItem('loginStateNakes')
                if(!value) {
                  registerToken();
                }
              } catch(e) {
                alert(e);
              }
            }
          }
        }else {
          registerToken();
        }
      }else {
        registerToken();
      }
    } catch(e) {
      // error reading value
      alert(e);
    }
  }

  /*const setDataNakes = async(val) => {
    dataNakes.push({
      id_nakes: val.data.id_nakes,
      nama_nakes: val.data.nama_nakes,
      hp: val.data.hp,
      id_profesi: val.data.id_profesi,
      profesi: val.data.profesi,
      foto_profile: val.data.foto_profile,
      verified: val.data.verified,
      status: val.data.status
    });
    token = val.token;
  }*/

  const handleSubmit = async() => {
    //alert(base_url); return;
    if(nohp !== '' && password !== '') {
      setLoading(true);

      if(deviceToken !== null) {
        let params = [];
        params.push({
          base_url: base_url,
          nohp: nohp,
          password: password,
          fcmToken: deviceToken
        });

        success = await formValidation.login(params);
        
        if(success.status === true) {
          if(success.res.responseCode !== '000') {
            await setErrMsg(success.res.messages);
            await setShowAlert(true);
          }else {
            //await setDataNakes(success.res);
            let nakes = [];
            nakes.push({
              id_nakes: success.res.data.id_nakes,
              nama_nakes: success.res.data.nama_nakes,
              hp: success.res.data.hp,
              id_profesi: success.res.data.id_profesi,
              profesi: success.res.data.profesi,
              foto_profile: success.res.data.foto_profile,
              verified: success.res.data.verified,
              status: success.res.data.status
            });
            await setDataNakes(nakes);
            await setToken(success.res.token);

            let params = [];
            params.push({
              base_url: base_url,
              nohp: nohp,
              operation: 'login'
            });
            getOTP = await formValidation.getOTP(params);

            if(getOTP.status === true) {
              await setDataOTP(getOTP.res);
              await setRelogin(true);
            }else {
              formValidation.showError('Terjadi kesalahan...');
            }
          }
          await setLoading(false);
        }
      }else {
        setLoading(false);
        formValidation.showError('Terjadi kesalahan...');
      }
    }
  }

  const onLoginSuccess = async () => {
    //alert(JSON.stringify(dataNakes)); return;
    try {
      await AsyncStorage.setItem('loginStateNakes', JSON.stringify(true));
      await AsyncStorage.setItem('hp', dataNakes[0].hp);
      await AsyncStorage.setItem('id_nakes', dataNakes[0].id_nakes);
      await AsyncStorage.setItem('nama_nakes', dataNakes[0].nama_nakes);
      await AsyncStorage.setItem('id_profesi', dataNakes[0].id_profesi);
      await AsyncStorage.setItem('profesi', dataNakes[0].profesi);
      await AsyncStorage.setItem('thumbProfile', base_url + 'data_assets/fotoProfileNakes/' + dataNakes[0].foto_profile);
      await AsyncStorage.setItem('verified', dataNakes[0].verified);
      await AsyncStorage.setItem('status', dataNakes[0].status);
      await AsyncStorage.setItem('token', token);

    } catch (error) {
      // Error saving data
      alert(error);
    }
    
    //props.navigation.navigate('mainMenuScreen', { base_url: base_url} );
    props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'MainApp',
                  params: { base_url: base_url },
                }
              ],
            })
          )
  }

  const onRegistrasi = () => {
    //alert(base_url);
    props.navigation.navigate('registrasiScreen', { base_url: base_url });
  }

  const resetPass = () => {
    props.navigation.navigate('resetPass', { base_url: base_url });
  }

  const showAlertBox = () => {
    return (
      <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Info"
          message={errMsg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          //showCancelButton={true}
          showConfirmButton={true}
          //cancelText="No, cancel"
          confirmText="Ok"
          confirmButtonColor="#DD6B55"
          //onCancelPressed={() => {
          //  setShowAlert(false);
          //}}
          onConfirmPressed={() => {
            setErrMsg('');
            setShowAlert(false);
          }}
        />
    )
  }

  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  const onChangeInput = (e) => {
    val = formValidation.onChangeInput(e);
    setPassword(val);
  }

  //cek OTP yg diinput user
  const handleValidationOTP = async () => {
    if(otp !== '') {
      if(!otp.match(/^[0-9]+$/)){
        setOtp('');
      }else {
        if(otp.length >= 6) {
          setLoading(true);
          const formData = new FormData();
          formData.append("hp", nohp);
          formData.append("otp", otp);
          formData.append("operation", dataOTP.operation);
          formData.append("datetime_created", dataOTP.datetime_created);
          formData.append("datetime_expired", dataOTP.datetime_expired);

          await axios
          .post(base_url + "pasien/verifyOTP/", formData)
          .then(res => {
            setLoading(false);
            if(res.data.responseCode !== '000') {
              setOtpVerified(false);
              setstyleOTP(styles.textInputError);
              setstyleBoxOTP(styles.box_otpError);
              formValidation.showError('Kode OTP salah...');
            }else {
              setstyleOTP(styles.textInput);
              setstyleBoxOTP(styles.box_otp);
              setOtpVerified(true);
            }
          })
          .catch(error=>{
            if(error.response != undefined && error.response.status == 404) {
              formValidation.showError('Terjadi kesalahan...');
            }else {
              formValidation.showError(error);
            }
          })
        }
      }
    }
  }

  function openUrl(e) {
    Linking.openURL(e);
  };

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, styles.inner]}>
          <View style={styles.scrollArea}>
            <Spinner
              visible={loading}
              textContent={''}
              textStyle={styles.spinnerTextStyle}
            />
            <View
              style={styles.Login}
              onLayout={event => setLayout(event.nativeEvent.layout)}>
              {!relogin ?
                <View style={styles.Group459(layout)}>
                  <View style={styles.Group744(layout)}>
                    <View style={{paddingBottom: 20}}>
                      <IconVissitin width={150} height={100} />
                    </View>
                    <View>
                      <Text style={styles.Txt6911}>*Hanya untuk tenaga kesehatan</Text>
                    </View>
                    <TextInput
                      style={styles.Form_pass_lama}
                      placeholder="No. Handphone"
                      keyboardType="numeric"
                      value={nohp}
                      onChangeText={onChangeHp}
                    />
                    <TextInput
                      style={styles.Form_pass_lama}
                      placeholder="Kata Sandi"
                      secureTextEntry={true}
                      value={password}
                      onChangeText={onChangeInput}
                    />
                  </View>

                  <View style={styles.wrapperBottom}>
                    <TouchableOpacity
                      onPress={handleSubmit}>
                      <View style={styles.Btn_lanjut}>
                        <Text style={styles.Txt691}>MASUK</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={resetPass}
                      style={{marginTop:'5%'}}>
                      <Text style={[styles.Txt691, {color: 'red', fontWeight: 'bold'}]}>Lupa Kata Sandi!</Text>
                    </TouchableOpacity>
                    <View style={{paddingVertical: 20}}>
                      <Text style={styles.Txt691}>Belum memiliki akun!</Text>
                      <TouchableOpacity
                        onPress={onRegistrasi}>
                        <Text style={styles.Txt691}>
                          DAFTAR <Text style={{color: '#43A9DD'}}>DISINI</Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.multiple1}>
                      Dengan masuk atau daftar, maka kamu sudah setuju dengan segala
                      <TouchableWithoutFeedback onPress={() => openUrl('https://vissit.in/syarat&ketentuan')}>
                        <Text style={{color: '#43A9DD'}}>{"\n"}Ketentuan Layanan </Text>
                      </TouchableWithoutFeedback>
                      dan
                      <TouchableWithoutFeedback onPress={() => openUrl('https://vissit.in/kebijakanprivasi')}>
                        <Text style={{color: '#43A9DD'}}> Kebijakan Privasi</Text>
                      </TouchableWithoutFeedback>
                      {"\n"}pada platform ini.
                    </Text>
                  </View>
                </View>
                :
                <View style={styles.OtpLogin(layout)}>
                  <View style={styles.Group089(layout)}>
                    {/*<View style={styles.Form_pass_lama}>*/}
                      <TextInput
                        placeholder="Masukkan Kode OTP"
                        keyboardType="numeric"
                        style={styles.Txt851}
                        numberOfLines={1}
                        maxLength={6}
                        onChangeText={setOtp}
                        editable={!otpVerified}
                      />
                    {/*</View>*/}
                  </View>
                  <View style={styles.wrapperBottom}>
                    <Text style={styles.multiple1}>
                      <Text style={{color: '#43A9DD'}}>Kode OTP </Text> akan dikirimkan pada
                      No. Whatsapp pastikan No handphone anda aktif pada
                      <Text style={{color: '#43A9DD'}}> Whatsapp </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setRelogin(false)}>
                      <View style={styles.Btn_lanjut}>
                        <Text style={styles.Txt4105}>KEMBALI</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              <View>
                {showAlertBox()}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(80,227,194,1)",
    borderWidth: 0,
    borderColor: "#000000"
  },
  containerKey: {
    flex: 1,
    paddingTop: '10%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around",
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea: {
    flex: 1,
  },
  Login: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(54,54,54,1)',
  },

  Group459: layout => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    none: '0px',
  }),
  Group744: layout => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
    marginHorizontal: '5%',
    width: layout.width,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }),

  Form_pass_lama: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(184,202,213,1)',
    width: '70%',
    height: Platform.OS === "ios" ? 40 : 40,
  },

  Btn_lanjut: {
    paddingVertical: '4%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#43A9DD',
    marginBottom: 10,
  },

  Txt691: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    // lineHeight: 14,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Txt6911: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  multiple1: {
    // width: '100%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },

  wrapperBottom: {
    flex: 0.6,
    paddingVertical: '5%',
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },

  OtpLogin: layout => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    none: '0px',
    backgroundColor: 'rgba(54,54,54,1)',
  }),
  Group089: layout => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '5%',
    paddingHorizontal: '5%',
    marginHorizontal: '5%',
    width: layout.width,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }),

  Form_pass: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Txt851: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    color: 'rgba(0,32,51,1)',
    borderColor: 'rgba(184,202,213,1)',
    width: '70%',
    height: Platform.OS === "ios" ? 40 : 40,
  },

  multiple1: {
    textAlign: 'center',
    color: 'white',
    paddingBottom: 25,
    marginHorizontal: 20,
  },
  wrepperLink: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  
  Txt4105: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    // lineHeight: 14,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
});
