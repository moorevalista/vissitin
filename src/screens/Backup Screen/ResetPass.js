import React, { Component, useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image
} from "react-native";

import { form_validation } from "../form_validation";
import { showMessage, hideMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

function ResetPass(props) {
  const formValidation = useContext(form_validation);
  const [loading, setLoading] = useState(false);

  const [nohp, setNohp] = useState('');
  const refHp = useRef(null);

  //validasi no hp
  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  const handleSubmit = async () => {
    if(nohp === '') {
      formValidation.showError('Masukkan nomor Handphone...');
      refHp.current.focus();
    }else if(nohp.length < 10) {
      formValidation.showError('Nomor Handphone tidak valid...');
      refHp.current.focus();
    }else {
      setLoading(true);
      let params = [];
      params.push({
        base_url: props.route.params.base_url,
        hp: nohp
      });

      success = await formValidation.forgotPassword(params);
      setLoading(false);
      if(success.status === true) {
        if(success.res.responseCode !== '000') {
          formValidation.showError(success.res.data.messages);
        }else {
          await formValidation.showError('Password berhasil dipulihkan. Silahkan cek tautan yang dikirim ke nomor handphone anda');
          props.navigation.goBack();
        }
      }
    }
  }

  return (
    <View style={styles.container}>
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
      <View style={styles.resetpassword}>
        <Text style={styles.resetPassword}>Reset Password</Text>
        <View style={Platform.OS === 'ios' ? styles.rectIOS :styles.rectAndroid}>
          <TextInput
            placeholder="No. Handphone"
            style={Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid}
            keyboardType="phone-pad"
            numberOfLines={1}
            value={nohp}
            onChangeText={onChangeHp}
            dataDetector="phoneNumber"
            maxLength={15}
            ref={refHp}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <View style={styles.btnReset}>
            <Text style={styles.reset2}>Reset</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  logoSmall: {
    marginTop: '40%',
    height: 86,
    width: 203,
    backgroundColor: "transparent",
    alignSelf: "center"
  },
  resetpassword: {
    marginTop: '15%',
    padding: '10%'
  },
  resetPassword: {
    backgroundColor: "transparent",
    color: "rgba(65,170,223,1)",
    fontSize: 24
  },
  rectIOS: {
    padding: '4%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,74,74,1)",
    marginTop: '2%',
  },
  rectAndroid: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,74,74,1)",
    marginTop: '2%',
  },
  inputIOS: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18
  },
  inputAndroid: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    paddingLeft: '4%',
    paddingRight: '4%'
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
  }
});

export default ResetPass;
