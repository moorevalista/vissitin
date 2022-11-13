import React, { Component, useEffect, useState, useContext } from "react";
import { ScrollView, TextInput, StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, useColorScheme, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import Nohp from "../components/Nohp";
import Pass from "../components/Pass";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";

import PushNotification, {Importance} from 'react-native-push-notification';

function Login(props) {
  const formValidation = useContext(form_validation);
  const base_url = formValidation.base_url;

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
                      name: 'mainMenuScreen',
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
                  name: 'mainMenuScreen',
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, styles.inner]}>
          <View style={styles.scrollArea}>
            <ScrollView
                      horizontal={false}
                      contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    >
              <Spinner
                  visible={loading}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                />

              <Image
                source={require("../assets/images/32625ed5621568fe6c39505f81174010ec65dba5.png")}
                resizeMode="cover"
                style={styles.logoSmall}
              ></Image>

              {!relogin ?
                <>
                  <View style={styles.group735}>
                    <Text style={styles.login1}>Login</Text>
                    <Nohp style={styles.nohp} nohp={nohp} setData={setData}></Nohp>
                    <Pass style={styles.pass} password={password} setData={setData}></Pass>
                    <Text style={styles.lupaPassword} onPress={resetPass}>Lupa Password ?</Text>
                  </View>

                  <TouchableOpacity style={styles.group729} onPress={handleSubmit}>
                    <View style={styles.rectangle9}>
                      <Text style={styles.text}>Login</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.group736}>
                    <Text style={styles.tidakMemilikiAkun}>
                      Tidak memiliki akun? Daftar <Text style={styles.bold} onPress={onRegistrasi}>disini</Text>
                    </Text>
                  </View>
                </>
                :
                  <View style={styles.isiotp}>
                    <View style={styleBoxOTP}>
                      <TextInput
                        placeholder="OTP"
                        keyboardType="phone-pad"
                        numberOfLines={1}
                        maxLength={6}
                        style={styleOTP}
                        onChangeText={setOtp}
                        editable={!otpVerified}
                      />
                    </View>

                    <TouchableOpacity style={styles.buttonBack} onPress={() => setRelogin(false)}>
                      <View style={styles.rectangle9}>
                        <Text style={styles.text}>Kembali</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
              }

              <View>
                {showAlertBox()}
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: '50%',
    paddingBottom: '25%'
  },
  containerKey: {
    flex: 1,
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
    top: '25%',
    left: 0,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  scrollArea_contentContainerStyle: {
    padding: 30
  },
  bold: {
    fontWeight: 'bold',
    color: 'red'
  },
  group729: {
    height: 52,
    marginTop: 40
  },
  rectangle9: {
    height: 52,
    width: 'auto',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    shadowColor: "rgba(241,247,255,1)",
    shadowOffset: {
      height: 7,
      width: -3
    },
    shadowRadius: 13,
    shadowOpacity: 1,
    backgroundColor: "rgba(65,170,223,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "rgba(250,250,250,1)",
    lineHeight: 17,
    fontSize: 16
  },
  group735: {
    height: 'auto',
    marginTop: 20
  },
  login1: {
    backgroundColor: "transparent",
    color: "rgba(65,170,223,1)",
    fontSize: 24
  },
  nohp: {
    marginTop: 12
  },
  pass: {
    marginTop: 10
  },
  lupaPassword: {
    color: "rgba(91,103,202,1)",
    lineHeight: 17,
    fontSize: 12,
    marginTop: 12,
    alignSelf: "center"
  },
  group736: {
    height: 'auto',
    marginTop: 20
  },
  tidakMemilikiAkun: {
    opacity: 0.800000011920929,
    color: "rgba(44,64,110,1)",
    lineHeight: 17,
    fontSize: 14,
    textAlign: "center",
    marginTop: 0
  },
  logoSmall: {
    height: 86,
    width: 203,
    backgroundColor: "transparent",
    alignSelf: "center"
  },
  isiotp: {
    flex: 1,
    marginTop: '10%'
  },
  box_otp: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,1)",
    alignSelf: "stretch"
  },
  box_otpError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    fontSize: 20,
    marginLeft: '5%',
    marginRight: '5%'
  },
  textInputError: {
    fontFamily: "roboto-regular",
    color: "red",
    flex: 1,
    fontSize: 20,
    marginLeft: '5%',
    marginRight: '5%'
  },
  buttonBack: {
    height: 52,
    marginTop: '5%'
  },
});

export default Login;
