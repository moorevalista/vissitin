import React, { Component, useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput, KeyboardAvoidingView, Keyboard,
  TouchableOpacity, TouchableWithoutFeedback
} from "react-native";
import { form_validation } from "../form_validation";
import { showMessage, hideMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

function ResetPass1(props) {
  const formValidation = useContext(form_validation);
  const base_url = formValidation.base_url;
  const [loading, setLoading] = useState(false);

  //alert(props.route.params.id);
  const id_nakes = props.route.params.id;
  const token = props.route.params.token;

  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const refPassword = useRef(null);
  const refCpassword = useRef(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);

  const [styleBoxPassword, setstyleBoxPassword] = useState(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);
  const [styleBoxCpassword, setstyleBoxCpassword] = useState(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);

  //show/hide password
  const toogleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  //show/hide confirm password
  const toogleSecureEntry1 = () => {
    setSecureTextEntry1(!secureTextEntry1);
  }

  //render icon show/hide password
  const RenderIcon = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry}>
        <Icon {...props} type="font-awesome-5" style={Platform.OS === 'ios' ? styles.iconIOS : styles.iconAndroid} name={secureTextEntry ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //render icon show/hide confirm password
  const RenderIcon1 = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry1}>
        <Icon {...props} type="font-awesome-5" style={Platform.OS === 'ios' ? styles.iconIOS : styles.iconAndroid} name={secureTextEntry1 ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //set textInput style ketika inputan tidak sesuai
  const setStyleError = (e) => {
    if(e.password !== '') {
      setstyleBoxPassword(Platform.OS === 'ios' ? styles.rectIOSError : styles.rectAndroidError);
    }else {
      setstyleBoxPassword(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);
    }
    if(e.cpassword !== '') {
      setstyleBoxCpassword(Platform.OS === 'ios' ? styles.rectIOSError : styles.rectAndroidError);
    }else {
      setstyleBoxCpassword(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);
    }
  }

  //handle input validation sebelum disubmit
  const handleValidSubmit = async(e, name) => {
    let fieldName = name;
    let errorMsg = {};

    switch(fieldName) {
      case 'password':
        if(password !== '') {
          let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
          if(password.length < 8) {
            errorMsg = '*Password minimal 8 digit';
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstyleBoxPassword(Platform.OS === 'ios' ? styles.rectIOSError : styles.rectAndroidError);
          }else if(!password.match(pattern)) {
            errorMsg = '*Password harus mengandung kombinasi huruf besar, kecil dan angka';
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstyleBoxPassword(Platform.OS === 'ios' ? styles.rectIOSError : styles.rectAndroidError);
          }else {
            errorMsg = '';
            setstyleBoxPassword(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);
          }
        }else {
          errorMsg = '';
          //formValidation.showError(errorMsg);
          setstyleBoxPassword(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);
        }
        break;
      case 'cpassword':
        if(cpassword !== '' && password !== '') {
          if(cpassword !== password) {
            errorMsg = '*Password tidak sama';
            formValidation.showError(errorMsg);
            refCpassword.current.focus();
            setstyleBoxCpassword(Platform.OS === 'ios' ? styles.rectIOSError : styles.rectAndroidError);
          }else {
            errorMsg = '';
            setstyleBoxCpassword(Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid);
          }
        }
        break;
    }

    //console.log(e.nativeEvent.text);
  }

  const handleSubmit = async () => {
    let params = [];
    params.push({
      base_url: base_url,
      en_id_nakes: id_nakes,
      password: password,
      cpassword: cpassword,
      token: token
    });

    val = formValidation.handlePreSubmitResetPassword(params);
    if(val.status === false) {
      setStyleError(val);
      if(val.password !== '') {
        formValidation.showError(val.password);
        refPassword.current.focus();
      }else if(val.cpassword !== '') {
        formValidation.showError(val.cpassword);
        refCpassword.current.focus();
      }
    }else if(val.status ===  true) {
      setLoading(true);
      success = await formValidation.resetPassword(params);
      setLoading(false);
      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          formValidation.showError(success.res.messages);
        }else {
          formValidation.showError(success.res.messages);
          props.navigation.navigate('loginScreen', { base_url: base_url });
        }
      }else {
        formValidation.showError('Tautan sudah kadaluarsa, silahkan ajukan reset password kembali...');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'loginScreen',
                params: { base_url: base_url },
              },
              {
                name: 'resetPass',
                params: { base_url: base_url },
              }
            ],
          })
        )
      }
    }
  }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, styles.inner]}>
            <Spinner
                        visible={loading}
                        textContent={''}
                        textStyle={styles.spinnerTextStyle}
                      />
            <View style={styles.inputpassnew}>
              <Image
                source={require("../assets/images/32625ed5621568fe6c39505f81174010ec65dba5.png")}
                resizeMode="cover"
                style={styles.logoSmall}
              ></Image>
              <Text style={styles.inputPasswordBaru}>Input Password Baru</Text>
              <View style={styleBoxPassword}>
                <TextInput
                  placeholder="Password Baru"
                  secureTextEntry={true}
                  style={Platform.OS === 'ios' ? styles.passnewIOS : styles.passnewAndroid}
                  numberOfLines={1}
                  minLength={8}
                  maxLength={15}
                  value={password}
                  onChangeText={setPassword}
                  onEndEditing={e => handleValidSubmit(e, 'password')}
                  secureTextEntry={secureTextEntry}
                  ref={refPassword}
                ></TextInput>
                <View style={Platform.OS === 'ios' ? styles.passIOS : styles.passAndroid}><RenderIcon /></View>
              </View>
              <View style={styleBoxCpassword}>
                <TextInput
                  placeholder="Ulangi Password Baru"
                  secureTextEntry={true}
                  style={Platform.OS === 'ios' ? styles.passnewIOS : styles.passnewAndroid}
                  numberOfLines={1}
                  minLength={8}
                  maxLength={15}
                  value={cpassword}
                  onChangeText={setCpassword}
                  onEndEditing={e => handleValidSubmit(e, 'cpassword')}
                  secureTextEntry={secureTextEntry1}
                  ref={refCpassword}
                ></TextInput>
                <View style={Platform.OS === 'ios' ? styles.passIOS : styles.passAndroid}><RenderIcon1 /></View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <View style={styles.btnReset}>
                  <Text style={styles.reset2}>Reset</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  containerKey: {
    flex: 1
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  logoSmall: {
    marginBottom: '10%',
    height: 86,
    width: 203,
    backgroundColor: "transparent",
    alignSelf: "center"
  },
  inputpassnew: {
    marginTop: 0,
    padding: '5%'
  },
  inputPasswordBaru: {
    backgroundColor: "transparent",
    color: "rgba(65,170,223,1)",
    fontSize: 24
  },
  rectIOS: {
    flexDirection: 'row',
    padding: '4%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,74,74,1)",
    marginTop: '2%',
  },
  rectIOSError: {
    flexDirection: 'row',
    padding: '4%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
    marginTop: '2%',
  },
  iconIOS: {
    flexDirection: "row",
    justifyContent: "flex-end",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    padding: '5%'
  },
  passIOS: {
    flex: 0.15,
    height: 30,
    alignSelf: 'flex-end'
  },
  passnewIOS: {
    flex: 0.85,
    height: 30,
    alignSelf: 'flex-start',
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18
  },
  button: {
    marginTop: '5%'
  },
  btnReset: {
    padding: '4%',
    borderRadius: 10,
    shadowColor: "rgba(241,247,255,1)",
    shadowOffset: {
      height: 7,
      width: -3
    },
    shadowRadius: 13,
    shadowOpacity: 1,
    backgroundColor: "rgba(65,170,223,1)"
  },
  reset2: {
    color: "rgba(250,250,250,1)",
    fontSize: 18,
    fontFamily: "roboto-regular",
    alignSelf: 'center'
  },
  rectAndroid: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,74,74,1)",
    marginTop: '2%',
  },
  rectAndroidError: {
    flexDirection: 'row',
    padding: '4%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "red",
    marginTop: '2%',
  },
  iconAndroid: {
    flexDirection: "row",
    justifyContent: "flex-end",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    padding: '5%'
  },
  passAndroid: {
    flex: 0.15,
    alignSelf: 'center'
  },
  passnewAndroid: {
    flex: 0.85,
    paddingLeft: '4%',
    paddingRight: '4%',
    alignSelf: 'flex-start',
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18
  },
});

export default ResetPass1;
