import React, { Component, useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Center } from "@builderx/utils";
import Svg, { Ellipse } from "react-native-svg";
import EntypoIcon from "react-native-vector-icons/Entypo";
import CupertinoButtonGrey from "../components/CupertinoButtonGrey";
import CupertinoButtonGrey1 from "../components/CupertinoButtonGrey1";

//import DropDownPicker from 'react-native-dropdown-picker';
import { form_validation } from "../form_validation";
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Icon } from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNPickerSelect from 'react-native-picker-select';
import Loader from '../components/Loader';

import axios from 'axios';

function Registrasi(props) {
  const formValidation = useContext(form_validation);

  //const [open, setOpen] = useState(false); //open-close Dropdown
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(true); //trigger fetch data profesi
  const [dataProfesi, setDataProfesi] = useState([]); //variable untuk menampung data profesi
  const [itemsProfesi, setItemsProfesi] = useState([]); //list data profesi untuk ditampilkan di Dropdown (ngambil dari dataProfesi)
  const [hpNotExist, setHpNotExist] = useState(false);
  const [statusReg, setStatusReg] = useState(false);
  const [notifReg, setNotifReg] = useState('');

  const [otp, setOtp] = useState('');
  const [dataOTP, setDataOTP] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [seconds, setSeconds] = useState(0);
  //const [timer, setTimer] = useState(null);
  const [otpMsg, setOtpMsg] = useState('');

  //variable untuk menampung data yang diinput
  const [namaDepan, setNamaDepan] = useState('');
  const [namaTengah, setNamaTengah] = useState('');
  const [namaBelakang, setNamaBelakang] = useState('');
  const [nohp, setNohp] = useState('');
  const [email, setEmail] = useState('');
  const [profesi, setProfesi] = useState(null); //selected value Dropdown
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const refNamaDepan = useRef(null);
  const refNamaTengah = useRef(null);
  const refNamaBelakang = useRef(null);
  const refNohp = useRef(null);
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refCpassword = useRef(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [buttonDaftar, setButtonDaftar] = useState(true);

  //style textInput
  const [styleNamaDepan, setstyleNamaDepan] = useState(styles.textInput);
  const [styleNamaTengah, setstyleNamaTengah] = useState(styles.textInput);
  const [styleNamaBelakang, setstyleNamaBelakang] = useState(styles.textInput);
  const [styleHp, setstyleHp] = useState(styles.textInput);
  const [styleMail, setstyleMail] = useState(styles.textInput);
  const [stylePassword, setstylePassword] = useState(styles.textPassword);
  const [styleCpassword, setstyleCpassword] = useState(styles.textPassword);
  const [styleOTP, setstyleOTP] = useState(styles.textInput);

  //style box textInput
  const [styleBoxNamaDepan, setstyleBoxNamaDepan] = useState(styles.nama_depan);
  const [styleBoxNamaTengah, setstyleBoxNamaTengah] = useState(styles.nama_belakang);
  const [styleBoxNamaBelakang, setstyleBoxNamaBelakang] = useState(styles.nama_gelar);
  const [styleBoxHp, setstyleBoxHp] = useState(styles.box_hp);
  const [styleBoxMail, setstyleBoxMail] = useState(styles.box_email);
  const [styleBoxProfesi, setstyleBoxProfesi] = useState(styles.pilihprofesi);
  const [styleBoxPassword, setstyleBoxPassword] = useState(styles.box_password);
  const [styleBoxCpassword, setstyleBoxCpassword] = useState(styles.box_password);
  const [styleBoxOTP, setstyleBoxOTP] = useState(styles.box_otp);

  useEffect(() => {
    setDataSource();
  },[]);

  //trigger fecth data profesi saat form loading
  useEffect(() => {
    if(dataProfesi) {
      listProfesi();
    }
  }, [dataProfesi]);

  const setDataSource = async () => {
    await getProfesi();

    await setLoading(false);
  }

  //fetch data profesi
  const getProfesi = async () => {
    axios
      .get(props.route.params.base_url + "nakes/getProfesi/")
      .then(res => {
        setDataProfesi(res.data.data);
        //setLoadingProfesi(false);
      })
      .catch(error => {
        if(error.response != undefined && error.response.status == 404) {
          alert(error.response.data.messages.error);
        }else {
          alert(error);
        }
        //setLoadingProfesi(false);
      })
      //listProfesi();
  }

  //show/hide password
  const toogleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  //show/hide confirm password
  const toogleSecureEntry1 = () => {
    setSecureTextEntry1(!secureTextEntry1);
  }

  //validasi no hp
  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  //rendering dataProfesi untuk dimasukkan ke variable items
  const listProfesi = async () => {
    const newItems = dataProfesi;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_profesi, label: item.profesi}
        )
      });
    }

    setItemsProfesi(options);
  }

  //render icon show/hide password
  const RenderIcon = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry}>
        <Icon {...props} type="font-awesome-5" style={styles.icon2} name={secureTextEntry ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //render icon show/hide confirm password
  const RenderIcon1 = (props) => {
    return (
      <TouchableWithoutFeedback onPress={toogleSecureEntry1}>
        <Icon {...props} type="font-awesome-5" style={styles.icon2} name={secureTextEntry1 ? 'eye' : 'eye-slash'}/>
      </TouchableWithoutFeedback>
    )
  }

  //set textInput style ketika inputan tidak sesuai
  const setStyleError = (e) => {
    //alert(JSON.stringify(e));
    if(e.namaDepan !== '') {
      setstyleBoxNamaDepan(styles.nama_depanError);
    }else {
      setstyleBoxNamaDepan(styles.nama_depan);
    }
    if(e.namaTengah !== '') {
      setstyleBoxNamaTengah(styles.nama_belakangError);
    }else {
      setstyleBoxNamaTengah(styles.nama_belakang);
    }
    if(e.namaBelakang !== '') {
      setstyleBoxNamaBelakang(styles.nama_gelarError);
    }else {
      setstyleBoxNamaBelakang(styles.nama_gelar);
    }
    if(e.nohp !== '') {
      setstyleBoxHp(styles.box_hpError);
    }else {
      setstyleBoxHp(styles.box_hp);
    }
    if(e.email !== '') {
      setstyleBoxMail(styles.box_emailError);
    }else {
      setstyleBoxMail(styles.box_email);
    }
    if(e.profesi !== '') {
      setstyleBoxProfesi(styles.pilihprofesiError);
    }else {
      setstyleBoxProfesi(styles.pilihprofesi);
    }
    if(e.password !== '') {
      setstyleBoxPassword(styles.box_passwordError);
    }else {
      setstyleBoxPassword(styles.box_password);
    }
    if(e.cpassword !== '') {
      setstyleBoxCpassword(styles.box_cpasswordError);
    }else {
      setstyleBoxCpassword(styles.box_cpassword);
    }
  }

  //request OTP
  const requestOTP = async () => {
    let paramsData = [];
    paramsData.push({
      namaDepan: namaDepan,
      namaTengah: namaTengah,
      namaBelakang: namaBelakang,
      nohp: nohp,
      email: email,
      profesi: profesi,
      password: password,
      cpassword: cpassword
    });

    val = formValidation.handlePreSubmit(paramsData);
    if(val.status === false) {
      setStyleError(val);
      formValidation.showError('*Data mandatory harus diisi');
    }else {
      let params = [];
      params.push({ base_url: props.route.params.base_url, nohp: nohp, hpNotExist: hpNotExist });
      success = await formValidation.requestOTP(params);

      //alert(JSON.stringify(success)); return;
      if(success.status === true) {
        await setOtpRequested(false);
        await setSeconds(60);
        await setDataOTP(success.res);
      }
      //console.log(seconds);
    }
  }

  //set timer setelah request OTP
  useEffect(() => {
    if(dataOTP !== '') {
      const timer = setInterval(() => {
        setSeconds(prevCount => {
          prevCount <= 1 && clearInterval(timer)
          //console.log(prevCount)
          prevCount <= 1 ? setOtpRequested(true):''
          return prevCount - 1
        }); // <-- Change this line!
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [dataOTP]);

  //trigger cek OTP yg diinput user
  useEffect(() => {
    handleValidationOTP()
  }, [otp]);

  //cek OTP yg diinput user
  const handleValidationOTP = async () => {
    if(otp !== '') {
      if(!otp.match(/^[0-9]+$/)){
        setOtp('');
      }else {
        if(otp.length >= 6) {
          const formData = new FormData();
          formData.append("hp", nohp);
          formData.append("otp", otp);
          formData.append("operation", dataOTP.operation);
          formData.append("datetime_created", dataOTP.datetime_created);
          formData.append("datetime_expired", dataOTP.datetime_expired);

          await axios
          .post(props.route.params.base_url + "nakes/checkOTP/", formData)
          .then(res => {
            if(res.data.responseCode !== '000') {
              setOtpVerified(false);
              setButtonDaftar(true);
              setstyleOTP(styles.textInputError);
              setstyleBoxOTP(styles.box_otpError);
              formValidation.showError('Kode OTP salah...');
            }else {
              setOtpVerified(true);
              setButtonDaftar(false);
              setSeconds(0);
              setstyleOTP(styles.textInput);
              setstyleBoxOTP(styles.box_otp);
              //setOtpMsg('');
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

  //cek HP apakah sudah terdaftar/belum
  const checkHP = async () => {
    if(nohp !== '' && nohp.length >= 10) {
      setLoadingSave(true);
      let params = [];
      params.push({ base_url: props.route.params.base_url, nohp: nohp });
      success = await formValidation.checkHP(params);
      //alert(JSON.stringify(success)); return;
      if(success.status === false) {
        setLoadingSave(false);
        setHpNotExist(false);
        setOtpRequested(false);
        setOtpVerified(true);
        setstyleHp(styles.textInputError);
        setstyleBoxHp(styles.box_hpError);
        //formValidation.showError(errorMsg);
        refNohp.current.focus();
        formValidation.showError(success.msg);
      }else {
        setLoadingSave(false);
        setHpNotExist(true);
        setOtpRequested(true);
        setOtpVerified(false);
        setstyleHp(styles.textInput);
        setstyleBoxHp(styles.box_hp);
      }
    }
  }

  //cek email apakah sudah terdaftar/belum
  const checkEmail = async () => {
    if(email !== '') {
      setLoadingSave(true);
      let params = [];
      params.push({ base_url: props.route.params.base_url, email: email });
      success = await formValidation.checkEmail(params);
      if(success.status === false) {
        setLoadingSave(false);
        setstyleMail(styles.textInputError);
        setstyleBoxMail(styles.box_emailError);
        //formValidation.showError(errorMsg);
        refEmail.current.focus();
        formValidation.showError(success.msg);
      }else {
        setLoadingSave(false);
        setstyleMail(styles.textInput);
        setstyleBoxMail(styles.box_email);
      }
    }
  }

  //ketika user klik tombol DAFTAR
  const handleSubmit = async () => {
    let paramsData = [];
    paramsData.push({
      namaDepan: namaDepan,
      namaTengah: namaTengah,
      namaBelakang: namaBelakang,
      nohp: nohp,
      email: email,
      profesi: profesi,
      password: password,
      cpassword: cpassword
    });

    //alert(JSON.stringify(paramsData));
    val = formValidation.handlePreSubmit(paramsData);
    if(val.status === false) {
      setStyleError(val);
      if(val.password !== '') {
        formValidation.showError(val.password);
      }else if(val.cpassword !== '') {
        formValidation.showError(val.cpassword);
      }
      //alert(JSON.stringify(val));
    }else if(val.status === true) {
      setLoadingSave(true);
      const formData = new FormData();
      formData.append("first_name", namaDepan);
      formData.append("middle_name", namaTengah);
      formData.append("last_name", namaBelakang);
      formData.append("hp", nohp);
      formData.append("email", email);
      formData.append("id_profesi", profesi);
      formData.append("password", password);

      axios
      .post(props.route.params.base_url + "nakes/registrasi/", formData)
      .then(() => {
        setLoadingSave(false);
        setNotifReg('Registrasi berhasil. Silahkan cek email untuk aktivasi akun anda.');
        setStatusReg(true);
      })
      .catch(error => {
        if(error.response != undefined && error.response.status == 404) {
            formValidation.showError('Terjadi kesalahan...');
          }else {
            formValidation.showError(error);
          }
          setLoadingSave(false);
      })
    }
  }

  //handle input validation sebelum disubmit
  const handleValidSubmit = async(e, name) => {
    let fieldName = name;
    let errorMsg = {};

    switch(fieldName) {
      case 'namaDepan':
        if(namaDepan !== '') {
          if(namaDepan.length < 3) {
            errorMsg = '*Nama depan tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaDepan.current.focus();
            setstyleNamaDepan(styles.textInputError);
          }else if(!namaDepan.match(/^[a-zA-Z .]+$/)) {
            errorMsg = '*Nama depan tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaDepan.current.focus();
            setstyleNamaDepan(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleNamaDepan(styles.textInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleNamaDepan(styles.textInput);
        }
        break;
      case 'namaTengah':
        if(namaTengah !== '') {
          if(namaTengah.length < 3) {
            errorMsg = '*Nama belakang tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaTengah.current.focus();
            setstyleNamaTengah(styles.textInputError);
          }else if(!namaTengah.match(/^[a-zA-Z .]+$/)) {
            errorMsg = '*Nama belakang tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaTengah.current.focus();
            setstyleNamaTengah(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleNamaTengah(styles.textInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleNamaTengah(styles.textInput);
        }
        break;
      case 'namaBelakang':
        if(namaBelakang !== '') {
          if(namaBelakang.length < 3) {
            errorMsg = '*Gelar tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaBelakang.current.focus();
            setstyleNamaBelakang(styles.textInputError);
          }else if(!namaBelakang.match(/^[a-zA-Z .,_-]+$/)) {
            errorMsg = '*Gelar tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refNamaBelakang.current.focus();
            setstyleNamaBelakang(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleNamaBelakang(styles.textInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleNamaBelakang(styles.textInput);
        }
        break;
      case 'nohp':
        if(nohp !== '') {
          if(nohp.length < 10) {
            errorMsg = '*Nomor handphone tidak valid';
            setErrorMsg(errorMsg);
            setOtpRequested(false);
            setOtpVerified(true);
            formValidation.showError(errorMsg);
            refNohp.current.focus();
            setstyleHp(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setOtpRequested(true);
            setOtpVerified(false);
            setstyleHp(styles.textInput);
            checkHP();
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setOtpRequested(true);
          setOtpVerified(false);
          setstyleHp(styles.textInput);
        }
        break;
      case 'email':
        if(email !== '') {
          let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          if(!email.match(pattern)) {
            errorMsg = '*Email tidak valid';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refEmail.current.focus();
            setstyleMail(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleMail(styles.textInput);
            checkEmail();
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstyleMail(styles.textInput);
        }
        break;
      case 'password':
        if(password !== '') {
          let pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
          if(password.length < 8) {
            errorMsg = '*Password minimal 8 digit';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstylePassword(styles.textInputError);
          }else if(!password.match(pattern)) {
            errorMsg = '*Password harus mengandung kombinasi huruf besar, kecil dan angka';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refPassword.current.focus();
            setstylePassword(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstylePassword(styles.textInput);
          }
        }else {
          errorMsg = '';
          setErrorMsg(errorMsg);
          setstylePassword(styles.textInput);
        }
        break;
      case 'cpassword':
        if(cpassword !== '' && password !== '') {
          if(cpassword !== password) {
            errorMsg = '*Password tidak sama';
            setErrorMsg(errorMsg);
            formValidation.showError(errorMsg);
            refCpassword.current.focus();
            setstyleCpassword(styles.textInputError);
          }else {
            errorMsg = '';
            setErrorMsg(errorMsg);
            setstyleCpassword(styles.textInput);
          }
        }
        break;
    }

    //console.log(e.nativeEvent.text);
  }

  useEffect(() => {
    showAlertBox()
  }, [statusReg])

  const showAlertBox = () => {
    return (
      <AwesomeAlert
          show={statusReg}
          showProgress={false}
          title="Info"
          message={notifReg}
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
            props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'loginScreen'
                  }
                ],
              })
            )
          }}
        />
    )
  }

  //render Dropdown data profesi untuk ditampilan di form
  /*const Profesi = () => {
    return (
      <DropDownPicker
        open={open}
        value={profesi}
        items={items}
        setOpen={setOpen}
        setValue={setProfesi}
        setItems={setItems}
        listMode="SCROLLVIEW"
        style={styleBoxProfesi}
        containerStyle={{}}
        textStyle={{color: "rgba(1,1,1,1)"}}
        labelStyle={{}}
        disabledStyle={{opacity: 0.5}}
        //searchable={true}
        selectedItemContainerStyle={{
          backgroundColor: "#9999"
        }}
      />
    )
  }*/

  const Profesi = () => {
    const items = itemsProfesi;
    const placeholder = {
      label: '*Pilih Profesi...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== profesi) {
                setProfesi(value)
              }
            }}
            style={pickerSelectStyles}
            value={profesi}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  return (
    !loading ?
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, styles.inner]}>
            <View style={styles.background1Stack}>
              <View style={styles.background1}>
                <View style={styles.headerStack}>
                  <View style={styles.header}></View>
                  <Center horizontal>
                    <View style={styles.group730}>
                      <View style={styles.ellipseStack}>
                        <Svg viewBox="0 0 112.73 112.73" style={styles.ellipse}>
                          <Ellipse
                            stroke="rgba(255,255,255,1)"
                            strokeWidth={5}
                            fill="#3a3a3c"
                            cx={56}
                            cy={56}
                            rx={54}
                            ry={54}
                          ></Ellipse>
                        </Svg>
                        <EntypoIcon name="news" style={styles.icon}></EntypoIcon>
                      </View>
                    </View>
                  </Center>
                </View>
              </View>
                <View style={styles.scrollArea}>
                  <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  >
                    <Spinner
                      visible={loadingSave}
                      textContent={''}
                      textStyle={styles.spinnerTextStyle}
                      color="#236CFF"
                      overlayColor="rgba(255, 255, 255, 0.5)"
                    />
                      <View style={styles.group731}>
                        <Text style={styles.pendaftaran}>Pendaftaran</Text>
                        <Text style={[styles.pendaftaran, {fontSize: 12, color: 'red'}]}>(*) Data mandatory</Text>
                        <View style={styles.namadepan}>
                          <View style={styleBoxNamaDepan}></View>
                          <TextInput
                            defaultValue=""
                            placeholder="*Nama Depan"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={styleNamaDepan}
                            maxLength={30}
                            value={namaDepan}
                            onChangeText={setNamaDepan}
                            onEndEditing={e => handleValidSubmit(e, 'namaDepan')}
                            autoCapitalize="words"
                            ref={refNamaDepan}
                            autoFocus={true}
                          ></TextInput>
                        </View>
                        <View style={styles.namabelakang}>
                          <View style={styleBoxNamaTengah}></View>
                          <TextInput
                            defaultValue=""
                            placeholder="Nama Belakang"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={styleNamaTengah}
                            maxLength={30}
                            value={namaTengah}
                            onChangeText={setNamaTengah}
                            onEndEditing={e => handleValidSubmit(e, 'namaTengah')}
                            autoCapitalize="words"
                            ref={refNamaTengah}
                          ></TextInput>
                        </View>
                        <View style={styles.gelar}>
                          <View style={styleBoxNamaBelakang}></View>
                          <TextInput
                            defaultValue=""
                            placeholder="Gelar"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={styleNamaBelakang}
                            maxLength={30}
                            value={namaBelakang}
                            onChangeText={setNamaBelakang}
                            onEndEditing={e => handleValidSubmit(e, 'namaBelakang')}
                            autoCapitalize="words"
                            ref={refNamaBelakang}
                          ></TextInput>
                        </View>
                        <View style={styles.nohandphone}>
                          <View style={styleBoxHp}></View>
                          <TextInput
                            placeholder="*No Handphone"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={styleHp}
                            value={nohp}
                            onChangeText={onChangeHp}
                            onEndEditing={e => handleValidSubmit(e, 'nohp')}
                            //onBlur={e => checkHP(e, 'nohp')}
                            keyboardType="phone-pad"
                            dataDetector="phoneNumber"
                            maxLength={15}
                            ref={refNohp}
                          ></TextInput>
                        </View>
                        <View style={styles.email}>
                          <View style={styleBoxMail}>
                          <TextInput
                            placeholder="*Email"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={styleMail}
                            keyboardType="email-address"
                            maxLength={50}
                            value={email}
                            onChangeText={setEmail}
                            onEndEditing={e => handleValidSubmit(e, 'email')}
                            //onBlur={e => checkEmail(e, 'email')}
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            ref={refEmail}
                          ></TextInput>
                          </View>
                        </View>

                        {itemsProfesi ?
                          <View style={styles.email}>
                            <View style={styleBoxProfesi}>
                            <Profesi />
                            </View>
                            
                          </View>
                          :
                          <></>
                        }
                        <Text style={styles.password}>Password</Text>
                        <View style={styleBoxPassword}>
                          <TextInput
                            placeholder="*Password"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={stylePassword}
                            minLength={8}
                            maxLength={15}
                            value={password}
                            onChangeText={setPassword}
                            onEndEditing={e => handleValidSubmit(e, 'password')}
                            secureTextEntry={secureTextEntry}
                            ref={refPassword}
                          ></TextInput>
                          <View style={styles.pass}><RenderIcon /></View>
                        </View>
                        <View style={styleBoxCpassword}>
                          <TextInput
                            placeholder="*Ulangi Password"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            style={styleCpassword}
                            minLength={8}
                            maxLength={15}
                            value={cpassword}
                            onChangeText={setCpassword}
                            onEndEditing={e => handleValidSubmit(e, 'cpassword')}
                            secureTextEntry={secureTextEntry1}
                            ref={refCpassword}
                          ></TextInput>
                          <View style={styles.repass}><RenderIcon1 /></View>
                        </View>
                        <View style={styles.isiotp}>
                          <View style={styleBoxOTP}></View>
                          <TextInput
                            placeholder="OTP"
                            placeholderTextColor="rgba(255,255,255,1)"
                            numberOfLines={1}
                            maxLength={6}
                            style={styleOTP}
                            onChangeText={setOtp}
                            editable={!otpVerified}
                          ></TextInput>
                        </View>
                        <CupertinoButtonGrey
                          style={styles.btnrequestotp}
                          otpRequested={otpRequested}
                          otpVerified={otpVerified}
                          nohp={nohp}
                          requestOTP={requestOTP}
                          seconds={seconds}
                        ></CupertinoButtonGrey>
                        <CupertinoButtonGrey1
                          style={styles.btndaftar}
                          handleSubmit={handleSubmit}
                          buttonDaftar={buttonDaftar}
                        ></CupertinoButtonGrey1>
                      </View>
                      <View>
                        {showAlertBox()}
                      </View>
                  </ScrollView>
                </View>
            </View>
            <FlashMessage position="top" />
          </View>
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
  background1: {
    top: 0,
    height: 786,
    position: "absolute",
    left: 0,
    right: 0
  },
  header: {
    top: 56,
    height: 731,
    position: "absolute",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: "#41aadf",
    flexDirection: "row",
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    left: 0,
    right: 0,
  },
  group730: {
    top: 0,
    width: 113,
    height: 113,
    position: "absolute",
  },
  ellipse: {
    top: 0,
    left: 0,
    width: 113,
    height: 113,
    position: "absolute"
  },
  icon: {
    top: 23,
    left: 27,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 60
  },
  ellipseStack: {
    width: 113,
    height: 113
  },
  headerStack: {
    flex: 1
  },
  scrollArea: {
    flex: 1,
    top: 131,
    left: 0,
    position: "absolute",
    right: 0,
    bottom: 0
  },
  scrollArea_contentContainerStyle: {
    padding: 30
  },
  group731: {
    height: 686,
    justifyContent: "space-between"
  },
  pendaftaran: {
    width: 345,
    backgroundColor: "transparent",
    color: "rgba(255,255,255,1)",
    fontSize: 24
  },
  namadepan: {
    height: 48,
    alignSelf: "stretch",
  },
  nama_depan: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  nama_depanError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  namabelakang: {
    height: 48,
    alignSelf: "stretch"
  },
  nama_belakang: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  nama_belakangError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  gelar: {
    height: 48,
    alignSelf: "stretch",
    width: 237,
  },
  nama_gelar: {
    width: 'auto',
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)"
  },
  nama_gelarError: {
    width: 'auto',
    height: 48,
    borderRadius: 10,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)"
  },
  nohandphone: {
    height: 48,
    alignSelf: "stretch"
  },
  box_hp: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  box_hpError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  email: {
    height: 48,
    alignSelf: "stretch"
  },
  box_email: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  box_emailError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  pilihprofesi: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
  },
  pilihprofesiError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
  },
  box_profesi: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  box_profesiError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  password: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,1)",
    fontSize: 16
  },
  pass: {
    height: 48,
    alignSelf: "flex-end"
  },
  box_password: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch",
  },
  box_passwordError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  box_cpassword: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  box_cpasswordError: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "stretch"
  },
  icon2: {
    flexDirection: "row",
    justifyContent: "center",
    height: 48,
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    paddingRight: '2%'
  },
  textInput: {
    top: 9,
    left: 10,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    height: 30,
    right: 8,
    padding: 0
  },
  textInputError: {
    top: 9,
    left: 10,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "red",
    height: 30,
    right: 8,
    padding: 0
  },
  textPassword: {
    top: 9,
    left: 10,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    height: 30,
    right: 8,
    padding: 0,
    width: '85%'
  },
  textPasswordError: {
    top: 9,
    left: 10,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "red",
    height: 30,
    right: 8,
    padding: 0,
    width: '85%'
  },
  repass: {
    height: 48,
    alignSelf: "flex-end"
  },
  rect13: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    alignSelf: "stretch"
  },
  isiotp: {
    width: 100,
    height: 48
  },
  box_otp: {
    width: 100,
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)"
  },
  box_otpError: {
    width: 100,
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "red"
  },
  btnrequestotp: {
    height: 48,
    width: 162,
    borderRadius: 100
  },
  btndaftar: {
    height: 44,
    alignSelf: "stretch"
  },
  background1Stack: {
    flex: 1,
    marginBottom: 0,
    marginTop: '15%'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    height: 30,
    width: '90%',
    top: 9,
    left: 10,
    right: 8,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    width: '90%',
    top: 0,
    left: 10,
    right: 8,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Registrasi;
