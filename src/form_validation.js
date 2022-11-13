import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import DataSheet_jam from './DataSheet_jam.js';
import { showMessage, hideMessage } from 'react-native-flash-message';
import moment from 'moment-timezone';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const APIKeyGoogle = 'AIzaSyCVZYXWQhorAn5yF0p_CBEioM71GA-bZ6I';
const baseUrl = 'https://apiuat.vissit.in/';
const flipPaymentUrl = 'https://flip.id/'; //production
const flipPaymentUrlConsolidation = 'https://flip.id/pwf/transaction/consolidation?redirected_from=internal&id='; //production
// const flipPaymentUrl = 'https://sandbox-test.flip.id/'; //sandbox
// const flipPaymentUrlConsolidation = 'https://sandbox-test.flip.id/pwf/transaction/consolidation?redirected_from=internal&id='; //sandbox

const dataSheets = {
  jam: new DataSheet_jam('jam'),
};

export const form_validation = React.createContext({
  env: 'development',
  base_url: baseUrl,
  flipPaymentUrl: flipPaymentUrl,
  flipPaymentUrlConsolidation: flipPaymentUrlConsolidation,
  theme: 'light',
  unreadMsg: false,
  unreadMsgCount: 0,
  getMsg: false,
  toggleTheme: () => {},

  onChangeHp: (currVal, val) => {
    //const numericRegex = /^([0-9]{1,13})$/
    const numericRegex = /^(0|08|08[0-9]{1,13})$/
    if(val !== '' && val !== null) {
      if(numericRegex.test(val)) {
          return(val);
      }else {
        return(currVal);
      }
    }else {
      return('');
    }
  },

  onChangeAccNumber: (currVal, val) => {
    //const numericRegex = /^([0-9]{1,13})$/
    const numericRegex = /^([0-9]{1,20})$/
    if(val !== '' && val !== null) {
      if(numericRegex.test(val)) {
          return(val);
      }else {
        return(currVal);
      }
    }else {
      return('');
    }
  },

  onChangeInput: (val) => {
    if(val !== '' && val !== null) {
      return(val);
    }else {
      return('');
    }
  },

  //registrasi
  handlePreSubmit: (params) => {
    let isValid = true;
    let responseMsg = {};

    if(params[0].cpassword !== '' && params[0].password !== '') {
      if(params[0].cpassword != params[0].password) {
        isValid = false;
        responseMsg['cpassword'] = '*Kata sandi tidak sama';
      }else {
        responseMsg['cpassword'] = '';
      }
    }else {
      isValid = false;
      responseMsg['cpassword'] = '*Kata sandi tidak boleh kosong';
    }

    if(params[0].password !== '') {
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(params[0].password.length < 8) {
        isValid = false;
        responseMsg['password'] = '*Kata sandi tidak valid';
      }else {
        if(!params[0].password.match(passPattern)) {
          isValid = false;
          responseMsg['password'] = '*Kata sandi tidak valid';
        }else {
          responseMsg['password'] = '';
        }
      }
    }else {
      isValid = false;
      responseMsg['password'] = '*Kata sandi tidak boleh kosong';
      responseMsg['cpassword'] = '';
    }

    if(params[0].profesi === '' || params[0].profesi === null) {
      isValid = false;
      responseMsg['profesi'] = '*Profesi tidak boleh kosong';
    }else {
      responseMsg['profesi'] = '';
    }

    if(params[0].email !== '') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(!params[0].email.match(pattern)){
        isValid = false;
        responseMsg['email'] = '*Email tidak valid';
      }else {
        responseMsg['email'] = '';
      }
    }else {
      isValid = false;
      responseMsg['email'] = '*Email tidak boleh kosong';
    }

    if(params[0].nophp !== '') {
      if(params[0].nohp.length < 10){
        isValid = false;
        responseMsg['nohp'] = '*No. Handphone tidak valid';
      }else {
        responseMsg['nohp'] = '';
      }
    }else {
      isValid = false;
      responseMsg['nohp'] = '*No. Handphone tidak boleh kosong';
    }

    if(params[0].namaBelakang !== '') {
      if(params[0].namaBelakang.length < 3){
        isValid = false;
        responseMsg['namaBelakang'] = '*Nama tidak valid';
      }else if(!params[0].namaBelakang.match(/^[a-zA-Z .,_-]+$/)){
        isValid = false;
        responseMsg['namaBelakang'] = '*Nama tidak valid';
      }else {
        responseMsg['namaBelakang'] = '';
      }
    }else {
      responseMsg['namaBelakang'] = '';
    }

    if(params[0].namaTengah !== '') {
      if(params[0].namaTengah.length < 3){
        isValid = false;
        responseMsg['namaTengah'] = '*Nama tidak valid';
      }else if(!params[0].namaTengah.match(/^[a-zA-Z .]+$/)){
        isValid = false;
        responseMsg['namaTengah'] = '*Nama tidak valid';
      }else {
        responseMsg['namaTengah'] = '';
      }
    }else {
      responseMsg['namaTengah'] = '';
    }

    if(params[0].namaDepan !== '') {
      if(params[0].namaDepan.length < 3){
        isValid = false;
        responseMsg['namaDepan'] = '*Nama tidak valid';
      }else if(!params[0].namaDepan.match(/^[a-zA-Z .]+$/)){
        isValid = false;
        responseMsg['namaDepan'] = '*Nama tidak valid';
      }else {
        responseMsg['namaDepan'] = '';
      }
    }else {
      isValid = false;
      responseMsg['namaDepan'] = '*Nama tidak boleh kosong';
    }

    //setErrorMsg(errorMsg);
    responseMsg['status'] = isValid;
    return(responseMsg);

  },

  //update Rekening
  handlePreSubmitRekening: (params) => {
    let isValid = true;
    let responseMsg = {};

    if(params[0].kode_bank !== '') {
      responseMsg['kode_bank'] = '';
    }else {
      isValid = false;
      responseMsg['kode_bank'] = '*Nama Bank tidak boleh kosong';
    }

    if(params[0].account_number !== '') {
      responseMsg['account_number'] = '';
    }else {
      isValid = false;
      responseMsg['account_number'] = '*Nomor rekening tidak boleh kosong';
    }

    //setErrorMsg(errorMsg);
    responseMsg['status'] = isValid;
    return(responseMsg);

  },

  checkHP: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    if(params[0].nohp !== '') {
      callBack = await axios
      .get(params[0].base_url + "nakes/validationHp/" + params[0].nohp)
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Nomor handphone sudah terdaftar";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  checkEmail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    if(params[0].nohp !== '') {
      callBack = await axios
      .get(params[0].base_url + "nakes/validationEmail/" + params[0].email)
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Email sudah terdaftar";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  //saat update data
  checkEmailUpdate: async (params) => {
    let callBack = [];
    let isValid = true;
    let en_id_nakes = params[0].en_id_nakes;
    let email = params[0].email;
    let responseMsg = {};

    if(email != '') {
      callBack = await axios
      .get(params[0].base_url + "nakes/validationEmailUpdate/" + en_id_nakes, {params: {email: email, token: params[0].token}})
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Email sudah terdaftar";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error =>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }
    return(callBack);
  },

  //cek password lama saat update password
  checkCurrentPassword: async (params) => {
    let callBack = [];
    let isValid = true;
    let id_nakes = params[0].id_nakes;
    let old_pass = params[0].old_pass;
    let responseMsg = {};

    //const data = new URLSearchParams();
    //data.append('old_password', old_pass);

    if(old_pass !== '') {
      callBack = await axios
      .get(params[0].base_url + "nakes/validationPassword/" + id_nakes, {params: {old_password: params[0].old_pass}})
      .then(res => {
        if(res.data.responseCode !== "000") {
          isValid = false;
          responseMsg['msg'] = "*Password lama salah";
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else {
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
          return(responseMsg);
        }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
          return(responseMsg);
        }
      })
    }
    return(callBack);
  },

  handlePreSubmitUpdatePassword: (params) => {
    let isValid = true;
    let responseMsg = {};

    const password = params[0].password;
    const cpassword = params[0].cpassword;

    if(!cpassword == '' && !password == '') {
      if(cpassword != password){
        isValid = false;
        responseMsg['cpassword'] = '*Kata sandi tidak sama';
      }else {
        responseMsg['cpassword'] = '';
      }
    }else {
      isValid = false;
      responseMsg['cpassword'] = '*Kata sandi tidak boleh kosong';
    }

    if(!password == '') {
      //let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(password.length < 8){
        isValid = false;
        responseMsg['password'] = '*Kata sandi tidak valid';
      }else {
        if(!password.match(passPattern)) {
          isValid = false;
          responseMsg['password'] = '*Kata sandi tidak valid';
        }else {
          responseMsg['password'] = '';
        }
      }
    }else {
      isValid = false;
      responseMsg['password'] = '*Kata sandi tidak boleh kosong';
      responseMsg['cpassword'] = '';
    }

    responseMsg['status'] = isValid;
    return(responseMsg);
  },

  //registrasi
  requestOTP: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';
    if(params[0].nohp !== '' && params[0].nohp !== undefined && params[0].hpNotExist) {
      callBack = await axios
      .get(params[0].base_url + "nakes/requestOTP/" + params[0].nohp)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = ''
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  getBank: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "nakes/getBank/")
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error =>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getPendidikan: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "nakes/getPendidikan/")
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error =>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getKategoriPasien: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getKategoriPasien/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getKlasifikasiPasien: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("id_profesi", params[0].id_profesi);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getKlasifikasiPasien/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getBiayaLayanan: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "nakes/getBiayaLayanan/" + params[0].id_nakes, {params: {token: params[0].token}})
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getPaketAll: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getPaketAll/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getJadwal: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getSchedule/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getJadwalSelesai: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getScheduleDone/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    return(callBack);
  },

  getJadwalNakes: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getJadwalNakes/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  checkJadwal: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("selectDate", params[0].selectDate);
      formData.append("id_paket", params[0].id_paket);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getScheduleByDate/", formData)
      .then(res => {
        isValid = true;
        res = res.data.result;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getJadwalAll: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("selectDate", params[0].selectDate);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getScheduleAll/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getDetailJadwal: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    if(params[0].id_jadwal !== '') {

      const formData = new FormData();
        formData.append("id_jadwal", params[0].id_jadwal);
        formData.append("token", params[0].token);

      callBack = await axios
        .post(params[0].base_url + "nakes/getDetailSchedule/", formData)
        .then(res => {
          isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
        })
        .catch(error=>{
          if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
        })
      return(callBack);
    }
  },

  getReservation: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getReservation/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getReservationDetail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getReservationDetail/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getPendingTrx: async (params, page = '', limit = '') => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getPendingTrx/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getPendingTrxDetail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getPendingTrxDetail/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getCloseTrx: async (params, page = '', limit = '') => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getCloseTrx/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getCloseTrxDetail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_detail", params[0].id_detail);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getCloseTrxDetail/", formData)
      .then(res => {
        //alert(JSON.stringify(res));
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getCancelTrx: async (params, page = '', limit = '') => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getCancelTrx/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getCancelTrxAll: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getCancelTrxAll/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getCancelTrxDetail: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getCancelTrxDetail/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getFilterReport: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);
      formData.append("filter", params[0].filter);

    callBack = await axios
      .post(params[0].base_url + "nakes/getAllReport/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getAllReport: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getAllReport/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data !== undefined && error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getCurrentReport: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getCurrentReport/", formData)
      .then(res => {
        isValid = true;
          res = res.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data !== undefined && error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  submitTolak: async(params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("alasanTolak", params[0].alasanTolak);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/rejectReservation/", formData)
      .then(res => {
        isValid = true;
          res = res.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  submitTerima: async(params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_jadwal", params[0].id_jadwal);
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/acceptReservation/", formData)
      .then(res => {
        isValid = true;
          res = res.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  saveJadwal: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("selectDate", params[0].selectDate);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("waktuPengganti", params[0].waktuPengganti);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/reSchedule/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
      return(callBack);
  },

  logout: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';
    
    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "/nakes/logout/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getLoginData: async () => {
    const params = [];
    try {
      const loginState = await AsyncStorage.getItem('loginStateNakes');
      const hp = await AsyncStorage.getItem('hp');
      const id_nakes = await AsyncStorage.getItem('id_nakes');
      const nama_nakes = await AsyncStorage.getItem('nama_nakes');
      const id_profesi = await AsyncStorage.getItem('id_profesi');
      const profesi = await AsyncStorage.getItem('profesi');
      const thumbProfile = await AsyncStorage.getItem('thumbProfile');
      const verified = await AsyncStorage.getItem('verified');
      let status = await AsyncStorage.getItem('status');
      const token = await AsyncStorage.getItem('token');

      if(id_nakes !== '' && token !== '') {
        let callBack = [];
        let isValid = true;
        let responseMsg = {};
        let res = '';
        
        const formData = new FormData();
        formData.append("id_nakes", id_nakes);
        formData.append("token", token);

        callBack = await axios
          .post(baseUrl + "/nakes/checkVerifiedStatus/", formData)
          .then(res => {
            isValid = true;
            res = res.data;
            responseMsg['msg'] = '';
            responseMsg['status'] = isValid;
            responseMsg['res'] = res;
            return(responseMsg);
          })
          .catch(error => {
            if(error.response !== undefined && error.response.status === 404) {
              isValid = false;
              responseMsg['msg'] = 'Terjadi kesalahan...';
              responseMsg['status'] = isValid;
            }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
              isValid = false;
              responseMsg['msg'] = error.response.data.messages.error;
              responseMsg['status'] = isValid;
            }else {
              isValid = false;
              responseMsg['msg'] = error;
              responseMsg['status'] = isValid;
            }
            return(responseMsg);
          })
          status = callBack.res.status_nakes;
      }

      await params.push({
        loginState: loginState,
        hp: hp,
        id_nakes: id_nakes,
        nama_nakes: nama_nakes,
        id_profesi: id_profesi,
        profesi: profesi,
        thumbProfile: thumbProfile,
        verified: verified,
        status: status,
        token: token
      });
      //setDataLogin(params);
      //alert(JSON.stringify(dataLogin));

    } catch (error) {
      // Error saving data
      alert(error);
    } finally {
      return(params);
      //await setLoading(false);
    }
  },

  getCurrentLoginData: async () => {
    const params = [];
    try {
      const loginState = await AsyncStorage.getItem('loginStateNakes');
      const hp = await AsyncStorage.getItem('hp');
      const id_nakes = await AsyncStorage.getItem('id_nakes');
      const nama_nakes = await AsyncStorage.getItem('nama_nakes');
      const id_profesi = await AsyncStorage.getItem('id_profesi');
      const profesi = await AsyncStorage.getItem('profesi');
      const thumbProfile = await AsyncStorage.getItem('thumbProfile');
      const verified = await AsyncStorage.getItem('verified');
      let status = await AsyncStorage.getItem('status');
      const token = await AsyncStorage.getItem('token');

      await params.push({
        loginState: loginState,
        hp: hp,
        id_nakes: id_nakes,
        nama_nakes: nama_nakes,
        id_profesi: id_profesi,
        profesi: profesi,
        thumbProfile: thumbProfile,
        verified: verified,
        status: status,
        token: token
      });
      //setDataLogin(params);
      //alert(JSON.stringify(dataLogin));

    } catch (error) {
      // Error saving data
      alert(error);
    } finally {
      return(params);
      //await setLoading(false);
    }
  },

  getLocationByAddress: async (address) => {
    //Geocode.setApiKey('AIzaSyCVZYXWQhorAn5yF0p_CBEioM71GA-bZ6I');

    Geocoder.init(APIKeyGoogle);

    const callBack = await Geocoder.from(address)
      .then(json => {
        var location = json.results[0].geometry.location;
        return(location);
      })
      .catch(error => {return(error)});

    return(callBack);
  },

  convertDecimal: (ev) => {
    let biaya = ev;
    biaya = biaya.replace(/\./g,"");
    let biaya_fix = biaya.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    biaya_fix = biaya_fix.replace(/,/g, ".");
    return biaya_fix;
  },

  getDataSheet: (sheetId) => {
    // This method is the default implementation and could be customized by a state management plugin.
    return dataSheets[sheetId];
  },

  //untuk menampilkan error
  showError: (e) => {
    showMessage({
      message: e,
      //description: "My message description",
      type: "default",
      backgroundColor: "#41aadf",
      color: "rgba(255,255,255,1)",
      duration: 5000
    });
  },

  // getAllChat: async (params, page, limit) => {
    getAllChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      // .post(params[0].base_url + "layanan/getAllChat/" + page + "/" + limit, formData)
      .post(params[0].base_url + "layanan/getAllChat/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  getDetailChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("id_chat", params[0].id_chat);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getDetailChat/", formData)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  sendChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_chat", params[0].id_chat);
    formData.append("id_sender", params[0].id_sender);
    formData.append("messages", params[0].messages);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/sendChat/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  saveMsgRef: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_chat", params[0].id_chat);
    formData.append("id_msg", params[0].id_msg);
    formData.append("id_sender", params[0].id_sender);
    formData.append("ref", params[0].ref);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/saveMsgRef/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  readChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("prevChat", JSON.stringify(params[0].prevChat));
    formData.append("id_sender", params[0].id_sender);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/readChat/", formData)
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  reqCheckIn: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/reqCheckIn/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
      return(callBack);
  },

  checkIn: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/check_In/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
      return(callBack);
  },

  handlePreSubmitReport: (params) => {
    let isValid = true;
    let responseMsg = {};

    const keluhan_utama = params[0].keluhan_utama;
    const pemeriksaan_umum = params[0].pemeriksaan_umum;
    const diagnosa_nakes = params[0].diagnosa_nakes;
    const intervensi = params[0].intervensi;
    const target_potensi = params[0].target_potensi;
    const home_program = params[0].home_program;

    if(!keluhan_utama == '') {
      if(keluhan_utama.length < 5){
        isValid = false;
        responseMsg['keluhan_utama'] = '*Pengisian tidak valid';
      }else {
        responseMsg['keluhan_utama'] = '';
      }
    }else {
      isValid = false;
      responseMsg['keluhan_utama'] = '*Data harus diisi';
    }

    if(!pemeriksaan_umum == '') {
      if(pemeriksaan_umum.length < 5){
        isValid = false;
        responseMsg['pemeriksaan_umum'] = '*Pengisian tidak valid';
      }else {
        responseMsg['pemeriksaan_umum'] = '';
      }
    }else {
      isValid = false;
      responseMsg['pemeriksaan_umum'] = '*Data harus diisi';
    }

    if(!diagnosa_nakes == '') {
      if(diagnosa_nakes.length < 5){
        isValid = false;
        responseMsg['diagnosa_nakes'] = '*Pengisian tidak valid';
      }else {
        responseMsg['diagnosa_nakes'] = '';
      }
    }else {
      isValid = false;
      responseMsg['diagnosa_nakes'] = '*Data harus diisi';
    }

    if(!target_potensi == '') {
      if(target_potensi.length < 5){
        isValid = false;
        responseMsg['target_potensi'] = '*Pengisian tidak valid';
      }else {
        responseMsg['target_potensi'] = '';
      }
    }else {
      isValid = false;
      responseMsg['target_potensi'] = '*Data harus diisi';
    }

    if(!intervensi == '') {
      if(intervensi.length < 5){
        isValid = false;
        responseMsg['intervensi'] = '*Pengisian tidak valid';
      }else {
        responseMsg['intervensi'] = '';
      }
    }else {
      isValid = false;
      responseMsg['intervensi'] = '*Data harus diisi';
    }

    if(!home_program == '') {
      if(home_program.length < 5){
        isValid = false;
        responseMsg['home_program'] = '*Pengisian tidak valid';
      }else {
        responseMsg['home_program'] = '';
      }
    }else {
      isValid = false;
      responseMsg['home_program'] = '*Data harus diisi';
    }

    responseMsg['status'] = isValid;
    return(responseMsg);
  },

  saveVisitReport: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_detail", params[0].id_detail);
      formData.append("dataLaporan", JSON.stringify(params[0].dataLaporan));

      if(params[0].dokumen_visit) {
        formData.append('dokumen_visit', {
          name: params[0].dokumen_visit.name,
          type: params[0].dokumen_visit.type,
          uri:
            Platform.OS === 'android' ? params[0].dokumen_visit.uri : params[0].dokumen_visit.uri.replace('file://', ''),
        });
      }

      if(params[0].foto_visit) {
        formData.append('foto_visit', {
          name: params[0].foto_visit.fileName,
          type: params[0].foto_visit.type,
          uri:
            Platform.OS === 'android' ? params[0].foto_visit.uri : params[0].foto_visit.uri.replace('file://', ''),
        });
      }
      
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/saveVisitReport/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res =>{
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
      return(callBack);
  },

  getJadwalAktif: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getJadwalAktifNow/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(responseMsg);
  },

  checkOut: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/checkOutNow/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(responseMsg);
  },

  genQrCode: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_jadwal", params[0].id_jadwal);
      formData.append("id_paket", params[0].id_paket);
      formData.append("id_detail", params[0].id_detail);
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/genQrCode/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(responseMsg);
  },

  forgotPassword: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .post(params[0].base_url + "nakes/forgot_password/" + params[0].hp)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(responseMsg);
  },

  //reset password
  handlePreSubmitResetPassword: (params) => {
    let isValid = true;
    let responseMsg = {};

    if(params[0].cpassword !== '' && params[0].password !== '') {
      if(params[0].cpassword != params[0].password) {
        isValid = false;
        responseMsg['cpassword'] = '*Kata sandi tidak sama';
      }else {
        responseMsg['cpassword'] = '';
      }
    }else {
      isValid = false;
      responseMsg['cpassword'] = '*Kata sandi tidak boleh kosong';
    }

    if(params[0].password !== '') {
      let passPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      if(params[0].password.length < 8) {
        isValid = false;
        responseMsg['password'] = '*Kata sandi tidak valid';
      }else {
        if(!params[0].password.match(passPattern)) {
          isValid = false;
          responseMsg['password'] = '*Kata sandi tidak valid';
        }else {
          responseMsg['password'] = '';
        }
      }
    }else {
      isValid = false;
      responseMsg['password'] = '*Kata sandi tidak boleh kosong';
      responseMsg['cpassword'] = '';
    }

    //setErrorMsg(errorMsg);
    responseMsg['status'] = isValid;
    return(responseMsg);

  },

  resetPassword: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("en_id_nakes", params[0].en_id_nakes);
      formData.append("password", params[0].password);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/resetPassword/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(responseMsg);
  },

  login: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("password", params[0].password);
    formData.append("fcmToken", params[0].fcmToken);

    callBack = await axios
      .post(params[0].base_url + "nakes/login/" + params[0].nohp, formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  sendNotif: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_pasien", params[0].id_pasien);
    formData.append("id_jadwal", params[0].id_jadwal);
    formData.append("id_chat", params[0].id_chat);
    formData.append("token", params[0].token);
    formData.append("notif_type", params[0].notif_type);

    callBack = await axios
      .post(params[0].base_url + "layanan/sendNotifClient/", formData)
      .then(res => {
        
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  convertToken: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("fcmToken", params[0].fcmToken);

    callBack = await axios
      .post(params[0].base_url + "layanan/convertToken/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getUnreadChat: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/getUnreadChat/", formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
        return(responseMsg);
      })
    return(callBack);
  },

  getEvent: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);
      formData.append("jenis_kegiatan", params[0].jenis_kegiatan);

    callBack = await axios
      .post(params[0].base_url + "nakes/getEvent/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getInfoLoker: async (params, page, limit) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
      formData.append("id_nakes", params[0].id_nakes);
      formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/getInfoLoker/" + page + "/" + limit, formData)
      .then(res => {
        isValid = true;
          res = res.data.data;
          responseMsg['msg'] = '';
          responseMsg['status'] = isValid;
          responseMsg['res'] = res;
          return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
            isValid = false;
            responseMsg['msg'] = 'Terjadi kesalahan...';
            responseMsg['status'] = isValid;
          }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
            isValid = false;
            responseMsg['msg'] = error.response.data.messages.error;
            responseMsg['status'] = isValid;
          }else {
            isValid = false;
            responseMsg['msg'] = error;
            responseMsg['status'] = isValid;
          }
          return(responseMsg);
      })
    return(callBack);
  },

  getAllFaskes: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    callBack = await axios
      .get(params[0].base_url + "nakes/getAllFaskes/", { params: {token: params[0].token} })
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error =>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  getAsyncStorage: async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  },

  updateReminderSet: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("id_nakes", params[0].id_nakes);
    formData.append("id_jadwal", params[0].id_jadwal);
    formData.append("id_paket", params[0].id_paket);
    formData.append("id_detail", params[0].id_detail);
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "layanan/updateReminderSet/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  cancelNotificationById: (id) => {
    //alert(id);
    PushNotification.cancelLocalNotification(id);
  },

  cancelNotification: () => {
    PushNotification.cancelAllLocalNotifications();
  },

  scheduleNotification: (date, params) => {
    PushNotification.localNotificationSchedule({
      id: params[0].id,
      //channelId: 'reminders',
      title: 'Vissit.in',
      message: 'Anda memiliki jadwal kunjungan atas nama ' + params[0].client + ' pada pukul ' + params[0].jam + ' WIB',
      date: date,
      //repeatType: 'minute',
      //repeatTime: 1
    });
  },

  getLocalData: async () => {
    const params = [];
    try {
      const loginState = await AsyncStorage.getItem('loginStateNakes');
      const hp = await AsyncStorage.getItem('hp');
      const id_nakes = await AsyncStorage.getItem('id_nakes');
      const nama_nakes = await AsyncStorage.getItem('nama_nakes');
      const id_profesi = await AsyncStorage.getItem('id_profesi');
      const profesi = await AsyncStorage.getItem('profesi');
      const thumbProfile = await AsyncStorage.getItem('thumbProfile');
      const verified = await AsyncStorage.getItem('verified');
      let status = await AsyncStorage.getItem('status');
      const token = await AsyncStorage.getItem('token');

      await params.push({
        loginState: loginState,
        hp: hp,
        id_nakes: id_nakes,
        nama_nakes: nama_nakes,
        id_profesi: id_profesi,
        profesi: profesi,
        thumbProfile: thumbProfile,
        verified: verified,
        status: status,
        token: token
      });

    } catch (error) {
      // Error saving data
      alert(error);
    } finally {
      return(params);
      //await setLoading(false);
    }
  },

  checkToken: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';

    const formData = new FormData();
    formData.append("token", params[0].token);

    callBack = await axios
      .post(params[0].base_url + "nakes/checkToken/", formData)
      .then(res => {
        isValid = true;
        res = res.data;
        responseMsg['msg'] = '';
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else if(error.response.data.status === 401 && error.response.data.messages.error === 'Expired token'){
          isValid = false;
          responseMsg['msg'] = error.response.data.messages.error;
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = error;
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
      return(callBack);
  },

  //relogin
  getOTP: async (params) => {
    let callBack = [];
    let isValid = true;
    let responseMsg = {};
    let res = '';
    if(params[0].nohp !== '' && params[0].nohp !== undefined) {
      callBack = await axios
      .get(params[0].base_url + "nakes/getOTP/" + params[0].nohp + '/' + params[0].operation)
      .then(res => {
        isValid = true;
        res = res.data.data;
        responseMsg['msg'] = ''
        responseMsg['status'] = isValid;
        responseMsg['res'] = res;
        return(responseMsg);
      })
      .catch(error=>{
        if(error.response !== undefined && error.response.status === 404) {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }else {
          isValid = false;
          responseMsg['msg'] = 'Terjadi kesalahan...';
          responseMsg['status'] = isValid;
        }
        return(responseMsg);
      })
    }else {
      responseMsg['msg'] = '';
      return(responseMsg);
    }
    return(callBack);
  },

  currencyFormat: (num) => {
    return 'Rp. ' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  },




});

