import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';
import { launchCamera, launchImageLibrary, ImagePicker } from 'react-native-image-picker';
import axios from 'axios';
import Loader from '../../components/Loader';
import RNPickerSelect from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';
import IconPanah from 'react-native-vector-icons/Ionicons';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function EditDataPribadi(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const dropDownRef = useRef();
  const [notifReg, setNotifReg] = useState('');
  const [statusUpdate, setStatusUpdate] = useState(false);

  const today = (moment(new Date()).format('YYYY-MM-DD')).toString();

  //data image
  const [imageProfile, setImageProfile] = useState('');
  const [imageKTP, setImageKTP] = useState('');
  const [imageNPWP, setImageNPWP] = useState('');
  const [imageSTR, setImageSTR] = useState('');
  const [imageSIP, setImageSIP] = useState('');

  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [location, setLocation] = useState('');

  //variable untuk menampung data input
  const [first_name, setFirst_name] = useState('');
  const [middle_name, setMiddle_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [hp, setHp] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [birth_place, setBirth_place] = useState('');
  const [birth_date, setBirth_date] = useState(new Date());
  const [ktp_address, setKtp_address] = useState('');
  const [id_provinsi, setId_provinsi] = useState('');
  const [id_kota, setId_kota] = useState('');
  const [id_kecamatan, setId_kecamatan] = useState('');
  const [id_kelurahan, setId_kelurahan] = useState('');
  const [kodepos, setKodepos] = useState('');

  const [nama_provinsi, setNama_provinsi] = useState('');
  const [nama_kota, setNama_kota] = useState('');
  const [nama_kecamatan, setNama_kecamatan] = useState('');
  const [nama_kelurahan, setNama_kelurahan] = useState('');
  const [full_address, setFull_address] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const [id_pendidikan, setId_pendidikan] = useState('');
  const [pendidikan, setPendidikan] = useState('');
  const [foto_profile, setFoto_profile] = useState('');
  const [foto_verified, setFoto_verified] = useState('');
  const [foto_ktp, setFoto_ktp] = useState('');
  const [ktp_verified, setKtp_verified] = useState('');
  const [foto_npwp, setFoto_npwp] = useState('');
  const [npwp_verified, setNpwp_verified] = useState('');
  const [foto_str, setFoto_str] = useState('');
  const [str_verified, setStr_verified] = useState('');
  const [foto_sip, setFoto_sip] = useState('');
  const [sip_verified, setSip_verified] = useState('');
  const [str_expired_date, setStr_expired_date] = useState(new Date());
  const [sip_expired_date, setSip_expired_date] = useState(new Date());

  const [locationValid, setLocationValid] = useState(false); //state location valid atau tidak saat update alamat

  //state untuk upload foto pertama kali/revisi sebelum akun terverifikasi
  const [uploadProfile, setUploadProfile] = useState(true);
  const [uploadKTP, setUploadKTP] = useState(true);
  const [uploadNPWP, setUploadNPWP] = useState(true);
  const [uploadSTR, setUploadSTR] = useState(true);
  const [uploadSIP, setUploadSIP] = useState(true);

  //state untuk menampilkan foto/hide foto jika sudah terverifikasi
  const [showProfile, setShowProfile] = useState(true);
  const [showKTP, setShowKTP] = useState(true);
  const [showNPWP, setShowNPWP] = useState(true);
  const [showSTR, setShowSTR] = useState(true);
  const [showSIP, setShowSIP] = useState(true);

  //state untuk menampung foto yang diupload
  const [fotoProfile, setFotoProfile] = useState('');
  const [thumbProfile, setThumbProfile] = useState('');
  const [fotoKTP, setFotoKTP] = useState('');
  const [thumbKTP, setThumbKTP] = useState('');
  const [fotoNPWP, setFotoNPWP] = useState('');
  const [thumbNPWP, setThumbNPWP] = useState('');
  const [fotoSTR, setFotoSTR] = useState('');
  const [thumbSTR, setThumbSTR] = useState('');
  const [fotoSIP, setFotoSIP] = useState('');
  const [thumbSIP, setThumbSIP] = useState('');

  //variable untuk menampung dataset dari database (pendidikan, provinsi, dll)
  const [dataPendidikan, setDataPendidikan] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [dataKecamatan, setDataKecamatan] = useState([]);
  const [dataKelurahan, setDataKelurahan] = useState([]);

  //variable untuk menampung list yang dirender dari dataset untuk ditampilkan pada dropdown (pendidikan, provinsi, dll)
  const [itemsPendidikan, setItemsPendidikan] = useState([]);
  const [itemsProvinsi, setItemsProvinsi] = useState([]);
  const [itemsKota, setItemsKota] = useState([]);
  const [itemsKecamatan, setItemsKecamatan] = useState([]);
  const [itemsKelurahan, setItemsKelurahan] = useState([]);
  /*const [openPendidikan, setOpenPendidikan] = useState(false); //open-close Dropdown Pendidikan
  const [openSex, setOpenSex] = useState(false); //open-close Dropdown Jenis Kelamin
  const [openProvinsi, setOpenProvinsi] = useState(false); //open-close Dropdown Provinsi
  const [openKota, setOpenKota] = useState(false); //open-close Dropdown Kota
  const [openKecamatan, setOpenKecamatan] = useState(false); //open-close Dropdown Kecamatan
  const [openKelurahan, setOpenKelurahan] = useState(false); //open-close Dropdown Kecamatan*/

  //date time picker
  //const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openDateSTR, setOpenDateSTR] = useState(false);
  const [openDateSIP, setOpenDateSIP] = useState(false);

  //ref untuk field input
  let refStr_expired_date = useRef(null);
  let refSip_expired_date = useRef(null);
  let refKodepos = useRef(null);
  let refKtp_address = useRef(null);
  let refBirth_date = useRef(null);
  let refBirth_place = useRef(null);
  let refEmail = useRef(null);

  const [styleStr_expired_date, setstyleStr_expired_date] = useState(styles.rect);
  const [styleSip_expired_date, setstyleSip_expired_date] = useState(styles.rect);
  const [styleKodepos, setstyleKodepos] = useState(styles.rect);
  const [styleId_kelurahan, setstyleId_kelurahan] = useState(styles.pendidikan);
  const [styleId_kecamatan, setstyleId_kecamatan] = useState(styles.pendidikan);
  const [styleId_kota, setstyleId_kota] = useState(styles.pendidikan);
  const [styleId_provinsi, setstyleId_provinsi] = useState(styles.pendidikan);
  const [styleKtp_address, setstyleKtp_address] = useState(styles.rect);
  const [styleBirth_date, setstyleBirth_date] = useState(styles.rect);
  const [styleBirth_place, setstyleBirth_place] = useState(styles.rect);
  const [styleId_pendidikan, setstyleId_pendidikan] = useState(styles.pendidikan);
  const [styleEmail, setstyleEmail] = useState(styles.rect);
  const [styleSex, setstyleSex] = useState(styles.sex);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(JSON.stringify(dataLogin));
        //await setLoading(false);
      }
    }
  }

  const getDataNakes = async () => {
    //alert(JSON.stringify(dataLogin[0].id_nakes));
    //alert(dataLogin[0].token); return;
    axios
      .get(props.route.params.base_url + "nakes/getUser/" + dataLogin.id_nakes, {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataNakes(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
      props.route.params.onRefresh();
    });

    return () => {
      unsubscribe;
    }
  }, [props.navigation]);

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);
    //getPendidikan();

    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      getDataNakes();
    }
  },[dataLogin]);

  useEffect(() => { //trigger render listPendidikan
    listPendidikan();
  }, [dataPendidikan]);

  useEffect(() => { //trigger render listProvinsi
    listProvinsi();
  }, [dataProvinsi]);

  useEffect(() => {
    listKota();
  }, [dataKota]);

  useEffect(() => {
    listKecamatan();
  }, [dataKecamatan]);

  useEffect(() => {
    listKelurahan();
  },[dataKelurahan]);

  useEffect(() => { //set existing data Nakes
    if(dataNakes) {
      //alert(JSON.stringify(dataNakes.data));
      setCurrentDataNakes();
    }
  }, [dataNakes]);

  const setCurrentDataNakes = async () => {
    //alert(dataLogin.first_name);
    //alert((dataNakes.data.id_provinsi));
    await setLoading(true);
    await setFirst_name(dataNakes.data.first_name);
    await setMiddle_name(dataNakes.data.middle_name);
    await setLast_name(dataNakes.data.last_name);
    await setHp(dataNakes.data.hp);
    await setEmail(dataNakes.data.email);
    await setSex(dataNakes.data.sex);
    await setBirth_place(dataNakes.data.birth_place);
    await setBirth_date(dataNakes.data.birth_date);
    await setKtp_address(dataNakes.data.ktp_address);
    await setId_provinsi(dataNakes.data.id_provinsi);
    await setId_kota(dataNakes.data.id_kota);
    await setId_kecamatan(dataNakes.data.id_kecamatan);
    await setId_kelurahan(dataNakes.data.id_kelurahan);
    await setKodepos(dataNakes.data.kodepos);

    await setNama_provinsi(dataNakes.data.nama_provinsi);
    await setNama_kota(dataNakes.data.nama_kota);
    await setNama_kecamatan(dataNakes.data.nama_kecamatan);
    await setNama_kelurahan(dataNakes.data.nama_kelurahan);
    await setFull_address(ktp_address + ', ' + nama_kelurahan + ', ' + nama_kecamatan + ', ' + nama_kota + ', ' + nama_provinsi + ' ' + kodepos);
    //setLat(location.lat);
    //setLon(location.lng);

    await setId_pendidikan(dataNakes.data.id_pendidikan);
    await setPendidikan(dataNakes.data.pendidikan);
    await setFoto_profile(dataNakes.data.foto_profile);
    await setFoto_verified(dataNakes.data.foto_verified);
    await setFoto_ktp(dataNakes.data.foto_ktp);
    await setKtp_verified(dataNakes.data.ktp_verified);
    await setFoto_npwp(dataNakes.data.foto_npwp);
    await setNpwp_verified(dataNakes.data.npwp_verified);
    await setFoto_str(dataNakes.data.foto_str);
    await setStr_verified(dataNakes.data.str_verified);
    await setFoto_sip(dataNakes.data.foto_sip);
    await setSip_verified(dataNakes.data.sip_verified);
    await setStr_expired_date(dataNakes.data.str_expired_date);
    await setSip_expired_date(dataNakes.data.sip_expired_date);

    if(dataNakes.data.foto_profile !== '' || dataNakes.data.foto_verified === 1) {
      await setThumbProfile(props.route.params.base_url + 'data_assets/fotoProfileNakes/' + dataNakes.data.foto_profile);
      await setUploadProfile(dataNakes.data.foto_verified === '1' ? false : true);
    }

    if(dataNakes.data.foto_ktp !== '' || dataNakes.data.ktp_verified === 1) {
      await setThumbKTP(props.route.params.base_url + 'data_assets/fotoKTPNakes/' + dataNakes.data.foto_ktp);
      await setUploadKTP(dataNakes.data.ktp_verified === '1' ? false : true);
      await setShowKTP(dataNakes.data.ktp_verified === 1 ? false : true);
    }

    if(dataNakes.data.foto_npwp !== '' || dataNakes.data.npwp_verified === 1) {
      await setThumbNPWP(props.route.params.base_url + 'data_assets/fotoNPWPNakes/' + dataNakes.data.foto_npwp);
      await setUploadNPWP(dataNakes.data.npwp_verified === '1' ? false : true);
      await setShowNPWP(dataNakes.data.npwp_verified === 1 ? false : true);
    }

    if(dataNakes.data.foto_str !== '' || dataNakes.data.str_verified === 1) {
      await setThumbSTR(props.route.params.base_url + 'data_assets/fotoSTRNakes/' + dataNakes.data.foto_str);
      await setUploadSTR(dataNakes.data.str_verified === '1' ? false : true);
      await setShowSTR(dataNakes.data.str_verified === 1 ? false : true);

      //cek expired STR
      let today = new Date();
      let sched = str_expired_date;
      let schedTime = new Date(sched);
      let sisaHari = (Math.floor(((schedTime - today))/(1000*60*60*24)));

      //console.log(sisaHari);

      await setUploadSTR((sisaHari < 30 || str_verified === 0) ? true : false);
      await setShowSTR((sisaHari < 30 || str_verified === 0) ? true : false);
    }

    if(dataNakes.data.foto_sip !== '' || dataNakes.data.sip_verified === 1) {
      await setThumbSIP(props.route.params.base_url + 'data_assets/fotoSIPNakes/' + dataNakes.data.foto_sip);
      await setUploadSIP(dataNakes.data.sip_verified === '1' ? false : true);
      await setShowSIP(dataNakes.data.sip_verified === 1 ? false : true);
    }

    await getPendidikan();
    await getProvinsi();
    if(dataNakes.data.id_provinsi !== null) { getKota(dataNakes.data.id_provinsi); }
    if(dataNakes.data.id_kota !== null) { getKecamatan(dataNakes.data.id_kota); }
    if(dataNakes.data.id_kecamatan !==  null) { getKelurahan(dataNakes.data.id_kecamatan); }
    await setLoading(false);
    //alert(JSON.stringify(dataNakes));
  }

  function getLocationByAddress(ev) {
    success = formValidation.getLocationByAddress(ev);
    //alert(JSON.stringify(success));
    setLocation(success);
    return(success);
  }

  //check Email
  const checkEmail = async (e) => {
    //setLoadingFetch(true);
    let params = [];
    params.push({ en_id_nakes: dataNakes.data.en_id_nakes, email: e, base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.checkEmailUpdate(params);
    
    if(success.status === false) {
      formValidation.showError(success.msg);
      refEmail.current.focus();
      setstyleEmail(styles.rectError);
    }else {
      setstyleEmail(styles.rect);
    }
    //setLoadingFetch(false);
  }

  //fetch list pendidikan
  const getPendidikan = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url });

    success = await formValidation.getPendidikan(params);
    
    if(success.status === true) {
      try {
        await setDataPendidikan(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  //fetch list provinsi
  const getProvinsi = async () => {
    axios
      .get(props.route.params.base_url + "nakes/getProvinsi/", {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataProvinsi(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kota
  const getKota = async (id) => {
    //alert(id); return;
    axios
      .get(props.route.params.base_url + "nakes/getKota/" + id, {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataKota(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kecamatan
  const getKecamatan = async (id) => {
    axios
      .get(props.route.params.base_url + "nakes/getKecamatan/" + id, {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataKecamatan(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kelurahan
  const getKelurahan = async (id) => {
    axios
      .get(props.route.params.base_url + "nakes/getKelurahan/" + id, {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataKelurahan(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  //fetch list kodepos
  const getKodepos = async (id) => {
    if(id !== '' && id !== null && id !== undefined) {
      const newItems = dataKelurahan.data;
      setKodepos(newItems.filter(
        item => item.id_kelurahan === id
      )[0].kodepos);
    }
  }

  //set listPendidikan dari dataset pendidikan
  const listPendidikan = async () => {
    const newItems = dataPendidikan;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_pendidikan, label: item.pendidikan}
        )
      });
    }

    setItemsPendidikan(options);
  }

  //set listProvinsi dari dataset provinsi
  const listProvinsi = async () => {
    const newItems = dataProvinsi.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_provinsi, label: item.nama_provinsi}
        )
      });
    }
    //console.log(options);
    setItemsProvinsi(options);
  }

  //set listKota dari dataset kota
  const listKota = async () => {
    const newItems = dataKota.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kota, label: item.nama_kota}
        )
      });
    }
    //console.log(options);
    setItemsKota(options);
  }

  //set listKecamatan dari dataset kecamatan
  const listKecamatan = async () => {
    const newItems = dataKecamatan.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kecamatan, label: item.nama_kecamatan}
        )
      });
    }
    //console.log(options);
    setItemsKecamatan(options);
  }

  //set listKelurahan dari dataset kelurahan
  const listKelurahan = async () => {
    const newItems = dataKelurahan.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kelurahan, label: item.nama_kelurahan}
        )
      });
    }
    //console.log(options);
    setItemsKelurahan(options);
  }

  //render Dropdown listPendidikan untuk ditampilkan di form
  const Pendidikan = () => {
    const items = itemsPendidikan;
    const placeholder = {
      label: 'Pilih Pendidikan...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_pendidikan) {
                setId_pendidikan(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_pendidikan}
            useNativeAndroidPickerStyle={true}
          />
    )
  }

  //render Dropdown list Jenis Kelamin untuk ditampilkan di form
  const Sex = () => {
    const placeholder = {
      label: 'Pilih Gender...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={[
              { label: 'Pria', value: 'Pria' },
              { label: 'Wanita', value: 'Wanita' },
            ]}
            onValueChange={(value) => {
              if(value !== sex) {
                setSex(value)
              }
            }}
            style={pickerSelectStyles}
            value={sex}
            useNativeAndroidPickerStyle={true}
          />
    )
  }

  useEffect(() => {
    if(updateData) {
      if(id_provinsi !== undefined && id_provinsi !== '' && id_provinsi !== null) {
        const newItems = itemsProvinsi.filter(
          item => item.value === id_provinsi
        );
        setNama_provinsi(newItems[0].label);

        getKota(id_provinsi);
      }
    }
  },[id_provinsi]);

  //render Dropdown listProvinsi untuk ditampilkan di form
  const Provinsi = () => {
    const items = itemsProvinsi;
    const placeholder = {
      label: 'Pilih Provinsi...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_provinsi) {
                setId_provinsi(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_provinsi}
            useNativeAndroidPickerStyle={true}
          />
    )
  }

  useEffect(() => {
    if(updateData) {
      if(id_kota !== undefined && id_kota !== '' && id_kota !== null) {
        const newItems = itemsKota.filter(
          item => item.value === id_kota
        );
        setNama_kota(newItems[0].label);

        getKecamatan(id_kota);
      }
    }
  },[id_kota]);

  //render Dropdown listKota untuk ditampilkan di form
  const Kota = () => {
    const items = itemsKota;
    const placeholder = {
      label: 'Pilih Kota...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_kota) {
                setId_kota(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_kota}
            useNativeAndroidPickerStyle={true}
          />
    )
  }

  useEffect(() => {
    if(updateData) {
      if(id_kecamatan !== undefined && id_kecamatan !== '' && id_kecamatan !== null) {
        const newItems = itemsKecamatan.filter(
          item => item.value === id_kecamatan
        );
        setNama_kecamatan(newItems[0].label);

        getKelurahan(id_kecamatan);
      }
    }
  },[id_kecamatan]);

  //render Dropdown listKecamatan untuk ditampilkan di form
  const Kecamatan = () => {
    const items = itemsKecamatan;
    const placeholder = {
      label: 'Pilih Kecamatan...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_kecamatan) {
                setId_kecamatan(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_kecamatan}
            useNativeAndroidPickerStyle={true}
          />
    )
  }

  useEffect(() => {
    if(updateData) {
      if(id_kelurahan !== undefined && id_kelurahan !== '' && id_kelurahan !== null) {
        const newItems = itemsKelurahan.filter(
          item => item.value === id_kelurahan
        );
        setNama_kelurahan(newItems[0].label);
        //alert(newItems[0].label);
        getKodepos(id_kelurahan);
      }
    }
  },[id_kelurahan]);

  //render Dropdown listKelurahan untuk ditampilkan di form
  const Kelurahan = () => {
    const items = itemsKelurahan;
    const placeholder = {
      label: 'Pilih Kelurahan...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== id_kelurahan) {
                setId_kelurahan(value)
              }
            }}
            style={pickerSelectStyles}
            value={id_kelurahan}
            useNativeAndroidPickerStyle={true}
          />
    )
  }

  /*const onPendidikanOpen = useCallback(() => {
    setOpenSex(false);
    setOpenProvinsi(false);
    setOpenKota(false);
    setOpenKecamatan(false);
    setOpenKelurahan(false);
  }, []);

  const onProvinsiOpen = useCallback(() => {
    setOpenSex(false);
    setOpenPendidikan(false);
    setOpenKota(false);
    setOpenKecamatan(false);
    setOpenKelurahan(false);
  }, []);

  const onKotaOpen = useCallback(() => {
    setOpenSex(false);
    setOpenPendidikan(false);
    setOpenProvinsi(false);
    setOpenKecamatan(false);
    setOpenKelurahan(false);
  }, []);

  const onKecamatanOpen = useCallback(() => {
    setOpenSex(false);
    setOpenPendidikan(false);
    setOpenProvinsi(false);
    setOpenKota(false);
    setOpenKelurahan(false);
  }, []);

  const onKelurahanOpen = useCallback(() => {
    setOpenPendidikan(false);
    setOpenProvinsi(false);
    setOpenKota(false);
    setOpenKecamatan(false);
    setOpenSex(false);
  }, []);

  const onSexOpen = useCallback(() => {
    setOpenPendidikan(false);
    setOpenProvinsi(false);
    setOpenKota(false);
    setOpenKecamatan(false);
    setOpenKelurahan(false);
  }, []);*/

  //cek apakah data yang akan disubmit sudah valid
  const handleValidSubmit = () => {
    //alert(str_expired_date);
    //alert(dataNakes.data.en_id_nakes); return;
    let isValid = true;
    let errorMsg = {};

    if(email !== '') {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if(!email.match(pattern)) {
        isValid = false;
        errorMsg = '*Email tidak valid';
        formValidation.showError(errorMsg);
        refEmail.current.focus();
        setstyleEmail(styles.rectError);
        return isValid;
      }else {
        isValid = true;
        errorMsg = '';
        setstyleEmail(styles.rect);
      }
    }else {
      isValid = false;
      errorMsg = '*Email harus diisi';
      formValidation.showError(errorMsg);
      refEmail.current.focus();
      setstyleEmail(styles.rectError);
      return isValid;
    }

    if(id_pendidikan === null) {
      isValid = false;
      errorMsg = '*Pendidikan harus diisi';
      formValidation.showError(errorMsg);
      setstyleId_pendidikan(styles.pendidikanError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_pendidikan(styles.pendidikan);
    }

    if(sex === null) {
      isValid = false;
      errorMsg = '*Jenis kelamin harus diisi';
      formValidation.showError(errorMsg);
      setstyleSex(styles.sexError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleSex(styles.sex);
    }

    if(birth_place !== '' && birth_place !== null && birth_place !== 'null') {
      if(birth_place.length < 3) {
        isValid = false;
        errorMsg = '*Tempat lahir tidak valid';
        formValidation.showError(errorMsg);
        refBirth_place.current.focus();
        setstyleBirth_place(styles.rectError);
        return isValid;
      }else {
        isValid = true;
        errorMsg = '';
        setstyleBirth_place(styles.rect);
      }
    }else {
      isValid = false;
      errorMsg = '*Tempat lahir harus diisi';
      formValidation.showError(errorMsg);
      refBirth_place.current.focus();
      setstyleBirth_place(styles.rectError);
      return isValid;
    }

    if(birth_date === '') {
      isValid = false;
      errorMsg = '*Tempat lahir harus diisi';
      formValidation.showError(errorMsg);
      refBirth_date.current.focus();
      setstyleBirth_date(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleBirth_date(styles.rect);
    }

    if(ktp_address !== '' && ktp_address !== null && ktp_address !== 'null') {
      if(ktp_address.length < 3) {
        isValid = false;
        errorMsg = '*Alamat tidak valid';
        formValidation.showError(errorMsg);
        refKtp_address.current.focus();
        setstyleKtp_address(styles.rectError);
        return isValid;
      }else {
        isValid = true;
        errorMsg = '';
        setstyleKtp_address(styles.rect);
      }
    }else {
      isValid = false;
      errorMsg = '*Alamat harus diisi';
      formValidation.showError(errorMsg);
      refKtp_address.current.focus();
      setstyleKtp_address(styles.rectError);
      return isValid;
    }

    if(id_provinsi === null || id_provinsi === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_provinsi.current.focus();
      setstyleId_provinsi(styles.pendidikanError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_provinsi(styles.pendidikan);
    }

    if(id_kota === null || id_kota === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_kota.current.focus();
      setstyleId_kota(styles.pendidikanError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_kota(styles.pendidikan);
    }

    if(id_kecamatan === null || id_kecamatan === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_kecamatan.current.focus();
      setstyleId_kecamatan(styles.pendidikanError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_kecamatan(styles.pendidikan);
    }

    if(id_kelurahan === null || id_kelurahan === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refId_kelurahan.current.focus();
      setstyleId_kelurahan(styles.pendidikanError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleId_kelurahan(styles.pendidikan);
    }

    if(kodepos === null || kodepos === '') {
      isValid = false;
      errorMsg = '*Alamat tidak lengkap';
      formValidation.showError(errorMsg);
      //refKodepos.current.focus();
      setstyleKodepos(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleKodepos(styles.rect);
    }

    if(str_expired_date === '' || str_expired_date === '0000-00-00') {
      isValid = false;
      errorMsg = '*Masa berlaku STR diisi';
      formValidation.showError(errorMsg);
      refStr_expired_date.current.focus();
      setstyleStr_expired_date(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleStr_expired_date(styles.rect);
    }

    if(sip_expired_date === '' || sip_expired_date === '0000-00-00') {
      isValid = false;
      errorMsg = '*Masa berlaku SIP diisi';
      formValidation.showError(errorMsg);
      refSip_expired_date.current.focus();
      setstyleSip_expired_date(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleSip_expired_date(styles.rect);
    }

    return isValid;
  }

  const onSubmit = async () => {
    //alert(moment(birth_date).format('YYYY-MM-DD')); return;
    if(handleValidSubmit()) {
      setLoadingSave(true);

      await setFull_address(ktp_address + ', ' + nama_kelurahan + ', ' + nama_kecamatan + ', ' + nama_kota + ', ' + nama_provinsi + ' ' + kodepos);
      const geoLocation = await getLocationByAddress(ktp_address + ', ' + nama_kelurahan + ', ' + nama_kecamatan + ', ' + nama_kota + ', ' + nama_provinsi + ' ' + kodepos);
      
      //console.log(JSON.stringify(geoLocation));
      
      if((geoLocation.lat !== '' && geoLocation.lat !== null) && (geoLocation.lng !== '' && geoLocation.lng !== null)) {
        //alert(JSON.stringify(geoLocation)); return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("sex", sex);
        formData.append("birth_place", birth_place);
        formData.append("birth_date", moment(birth_date).format('YYYY-MM-DD'));
        formData.append("ktp_address", ktp_address);
        formData.append("id_kelurahan", id_kelurahan);
        formData.append("lat", geoLocation.lat);
        formData.append("lon", geoLocation.lng);
        formData.append("id_pendidikan", id_pendidikan);
        //formData.append("fotoProfile", fotoProfile);
        //formData.append("fotoKtp", fotoKTP);
        //formData.append("fotoNpwp", fotoNPWP);
        //formData.append("fotoStr", fotoSTR);
        //formData.append("fotoSip", fotoSIP);
        formData.append("str_expired_date", moment(str_expired_date).format('YYYY-MM-DD'));
        formData.append("sip_expired_date", moment(sip_expired_date).format('YYYY-MM-DD'));
        formData.append("token", dataLogin.token);

        if(imageProfile) {
          formData.append('fotoProfile', {
            name: imageProfile.fileName,
            type: imageProfile.type,
            uri:
              Platform.OS === 'android' ? imageProfile.uri : imageProfile.uri.replace('file://', ''),
          });
        }

        if(imageKTP) {
          formData.append('fotoKtp', {
            name: imageKTP.fileName,
            type: imageKTP.type,
            uri:
              Platform.OS === 'android' ? imageKTP.uri : imageKTP.uri.replace('file://', ''),
          });
        }

        if(imageNPWP) {
          formData.append('fotoNpwp', {
            name: imageNPWP.fileName,
            type: imageNPWP.type,
            uri:
              Platform.OS === 'android' ? imageNPWP.uri : imageNPWP.uri.replace('file://', ''),
          });
        }

        if(imageSTR) {
          formData.append('fotoStr', {
            name: imageSTR.fileName,
            type: imageSTR.type,
            uri:
              Platform.OS === 'android' ? imageSTR.uri : imageSTR.uri.replace('file://', ''),
          });
        }

        if(imageSIP) {
          formData.append('fotoSip', {
            name: imageSIP.fileName,
            type: imageSIP.type,
            uri:
              Platform.OS === 'android' ? imageSIP.uri : imageSIP.uri.replace('file://', ''),
          });
        }

        axios
          .post(props.route.params.base_url + "nakes/updateDataNakes/" + dataNakes.data.en_id_nakes, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res =>{
            setLoadingSave(false);
            //alert(JSON.stringify(res)); return;
            if(res.data.responseCode !== "000") {
              //alert(JSON.stringify(res.data)); return;
              formValidation.showError((res.data.messages[0] !== undefined && res.data.messages[0].length > 1) ? res.data.messages[0] : res.data.messages);
            }else {
              if(res.data.thumbProfile !== '') {
                AsyncStorage.setItem('thumbProfile', props.route.params.base_url + 'data_assets/fotoProfileNakes/' + res.data.thumbProfile);
              }
              AsyncStorage.setItem('status', res.data.status_nakes);
              //alert(res.data.status_nakes);
              setUpdateData(false);
              formValidation.showError('Data berhasil disimpan...');

              props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: 'MainApp',
                      params: { base_url: props.route.params.base_url },
                    },
                    {
                      name: 'settingScreen',
                      params: { base_url: props.route.params.base_url },
                    }
                  ],
                })
              )
              //setNotifReg('Data berhasil disimpan...');
              //setStatusUpdate(true);
            }
          }))
          .catch(error => {
            setLoadingSave(false);
            //alert(error); return;
            if(error.response != undefined && error.response.status == 404) {
              formValidation.showError('Terjadi kesalahan...');
            }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
              formValidation.showError(error.response.data.messages.error);
            }else {
              formValidation.showError(error);
            }
          })
      }else {
        formValidation.showError('Gagal mendapatkan lokasi, pastikan GPS anda aktif.');
      }
    }
  }

  useEffect(() => {
    showAlertBox()
  }, [statusUpdate])

  const showAlertBox = () => {
    return (
      <AwesomeAlert
          show={statusUpdate}
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
        />
    )
  }

  const onCancel = async () => {
    //alert(birth_date);
    setUpdateData(!updateData);
    (dataNakes ? setCurrentDataNakes():'');
  }

  const handleChoosePhoto = (name) => {
    let options = {
      mediaType: 'photo',
      maxWidth: 1024
    };

    launchImageLibrary(options, (response) => { // Use launchImageLibrary to open image gallery
      //console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
        //if((response.assets[0].fileSize * 10240) > 2048) {
        //  showError('Ukuran foto tidak boleh lebih dari 2Mb !!!');
        //  return;
        //}

        const source = response.assets[0].uri;
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        console.log(source);
        switch(name) {
          case 'Profile':
            setThumbProfile(source);
            setImageProfile(response.assets[0]);
            break;
          case 'KTP':
            setThumbKTP(source);
            setImageKTP(response.assets[0]);
            break;
          case 'NPWP':
            setThumbNPWP(source);
            setImageNPWP(response.assets[0]);
            break;
          case 'STR':
            setThumbSTR(source);
            setImageSTR(response.assets[0]);
            break;
          case 'SIP':
            setThumbSIP(source);
            setImageSIP(response.assets[0]);
            break;
        }
        
        //console.log(imageKTP.height);
      }
    });
  }

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 28,
            fontWeight: 'bold',
            opacity: 1,
          }}
          name={name}
        />
      );
    }else if (label === 'Kamera') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 28,
            fontWeight: 'bold',
            opacity: 1,
            alignSelf: 'center',
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
      <SafeAreaView style={styles.container}>

        <Spinner
          size="small"
          animation="fade"
          visible={loadingFetch}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
          color="#D13395"
          overlayColor="rgba(255, 255, 255, 0.5)"
        />
        <Spinner
          visible={loadingSave}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
          color="#236CFF"
          overlayColor="rgba(255, 255, 255, 0.5)"
        />

      
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal={false}
          contentContainerStyle={styles.scrollArea_contentContainerStyle}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => null} />
          }>
          <View style={styles.Group326}>
            <View style={styles.Group0401}>
              <View style={{width: '100%'}}>
                <TouchableOpacity style={[styles.Tbl_iconPanah]} onPress={!updateData ? () => setUpdateData(!updateData) : onCancel}>
                  {!updateData ?
                    <Icons color="rgba(0,0,0,1)" label="Panah" name="create" />
                    :
                    <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                  }
                </TouchableOpacity>
              </View>

              <TouchableOpacity disabled={(uploadProfile !== undefined && uploadProfile) ? !updateData : true} onPress={() => handleChoosePhoto('Profile')}>
                <Image
                  style={styles.Useravatar}
                  source={thumbProfile ? {uri: thumbProfile} : require("../../assets/images/profile-01.png")}
                />
              </TouchableOpacity>
              <Text style={styles.Txt279}>Foto Profil</Text>
            </View>
            <View style={styles.Group040}>
              <Text style={styles.Txt798}>*Wajib diisi</Text>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Nama Depan</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="*Nama Depan"
                    editable={false}
                    value={first_name}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Nama Belakang</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="Nama Belakang"
                    editable={false}
                    value={middle_name}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Gelar</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="Gelar"
                    editable={false}
                    value={last_name}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*No. Handphone</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="*No. Handphone"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="phoneNumber"
                    keyboardType="phone-pad"
                    editable={false}
                    value={hp}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>*Email Aktif</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    keyboardType="email-address"
                    placeholder="*Email Aktif"
                    editable={updateData}
                    maxLength={50}
                    onChangeText={(e) => {
                      setEmail(e);
                      //checkEmail(e);
                    }}
                    onEndEditing={(e) => checkEmail(e.nativeEvent.text)}
                    ref={refEmail}
                    autoCapitalize="none"
                    value={email}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Pendidikan</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <Pendidikan />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Jenis Kelamin</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <Sex />
                </View>
              </View>

              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Tempat Lahir</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="Tempat Lahir"
                    editable={updateData}
                    maxLength={50}
                    onChangeText={setBirth_place}
                    ref={refBirth_place}
                    autoCapitalize="words"
                    value={birth_place}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Tanggal Lahir</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="Tanggal Lahir"
                    showSoftInputOnFocus={false}
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="calendarEvent"
                    editable={updateData}
                    ref={refBirth_date}
                    onFocus={() => setOpenDate(true)}
                  >{(birth_date !== null && birth_date !== '0000-00-00') ? moment(birth_date).format('DD/MM/YYYY'):''}
                    <DatePicker
                      theme='auto'
                      modal
                      //locale="en"
                      mode="date"
                      open={openDate}
                      date={(birth_date !== '0000-00-00' && birth_date !== null) ? new Date(birth_date):new Date()}
                      maximumDate={new Date('2004-12-31')}
                      onConfirm={(date) => {
                        setOpenDate(false)
                        setBirth_date(date)
                      }}
                      onCancel={() => {
                        setOpenDate(false)
                      }}
                    />
                  </TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Alamat Tempat Tinggal</Text>
                <View style={[styles.Form_pass_lama, {height: 80, paddingVertical: 10}]}>
                  <TextInput
                    style={[styles.Txt346, {flex: 1}]}
                    placeholder="Alamat Tempat Tinggal"
                    editable={updateData}
                    multiline={true}
                    maxLength={255}
                    onChangeText={(e) => {
                      setKtp_address(e);
                      setId_kelurahan('');
                      setKodepos('');
                    }}
                    ref={refKtp_address}
                    autoCapitalize="words"
                  >{ktp_address}</TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Provinsi</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <Provinsi />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Kabupaten</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <Kota />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Kecamatan</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <Kecamatan />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Kelurahan</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <Kelurahan />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Kode Pos</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    placeholder="Kode Pos"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="none"
                    editable={false}
                    ref={refKodepos}
                    value={kodepos}
                  />
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Masa Berlaku STR</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    showSoftInputOnFocus={false}
                    placeholder="Masa Berlaku STR"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="calendarEvent"
                    editable={updateData}
                    ref={refStr_expired_date}
                    onFocus={() => setOpenDateSTR(true)}
                  >{(str_expired_date !== null && str_expired_date !== '0000-00-00') ? moment(str_expired_date).format('DD/MM/YYYY'):''}
                    <DatePicker
                      theme='auto'
                      modal
                      //locale="en"
                      mode="date"
                      open={openDateSTR}
                      date={(str_expired_date !== '0000-00-00' && str_expired_date !== null) ? new Date(str_expired_date):new Date()}
                      minimumDate={new Date(today)}
                      onConfirm={(date) => {
                        setOpenDateSTR(false)
                        setStr_expired_date(date)
                      }}
                      onCancel={() => {
                        setOpenDateSTR(false)
                      }}
                    />
                  </TextInput>
                </View>
              </View>
              <View style={styles.Nama_lengkap}>
                <Text style={styles.Txt869}>Masa Berlaku SIP</Text>
                <View style={styles.Form_pass_lama}>
                  <TextInput
                    style={styles.Txt346}
                    showSoftInputOnFocus={false}
                    placeholder="Masa Berlaku SIP"
                    clearButtonMode="never"
                    textBreakStrategy="simple"
                    dataDetector="calendarEvent"
                    style={styles.textInput}
                    editable={updateData}
                    ref={refSip_expired_date}
                    onFocus={() => setOpenDateSIP(true)}
                  >{(sip_expired_date !== null && sip_expired_date !== '0000-00-00') ? moment(sip_expired_date).format('DD/MM/YYYY'):''}
                    <DatePicker
                      theme='auto'
                      modal
                      //locale="en"
                      mode="date"
                      open={openDateSIP}
                      date={(sip_expired_date !== '0000-00-00' && sip_expired_date !== null) ? new Date(sip_expired_date):new Date()}
                      minimumDate={new Date(today)}
                      onConfirm={(date) => {
                        setOpenDateSIP(false)
                        setSip_expired_date(date)
                      }}
                      onCancel={() => {
                        setOpenDateSIP(false)
                      }}
                    />
                  </TextInput>
                </View>
              </View>

              <Text style={styles.Txt869}>Foto KTP</Text>
              <TouchableOpacity style={styles.Nama_lengkap} onPress={(uploadKTP && updateData) ? () => handleChoosePhoto('KTP') : null}>
                {thumbKTP !== '' ?
                  <Image
                    style={styles.uploadImage}
                    source={{uri: thumbKTP}}
                    resizeMode="contain"
                  />
                  :
                  <View style={styles.uploadImage}>
                    <Icons color="rgba(0,0,0,1)" label="Kamera" name="camera" />
                  </View>
                }
              </TouchableOpacity>

              <Text style={styles.Txt869}>Foto NPWP</Text>
              <TouchableOpacity style={styles.Nama_lengkap} onPress={(uploadNPWP && updateData) ? () => handleChoosePhoto('NPWP') : null}>
                {thumbNPWP !== '' ?
                  <Image
                    style={styles.uploadImage}
                    source={{uri: thumbNPWP}}
                    resizeMode="contain"
                  />
                  :
                  <View style={styles.uploadImage}>
                    <Icons color="rgba(0,0,0,1)" label="Kamera" name="camera" />
                  </View>
                }
              </TouchableOpacity>

              <Text style={styles.Txt869}>Upload STR</Text>
              <TouchableOpacity style={styles.Nama_lengkap} onPress={(uploadSTR && updateData) ? () => handleChoosePhoto('STR') : null}>
                {thumbSTR !== '' ?
                  <Image
                    style={styles.uploadImage}
                    source={{uri: thumbSTR}}
                    resizeMode="contain"
                  />
                  :
                  <View style={styles.uploadImage}>
                    <Icons color="rgba(0,0,0,1)" label="Kamera" name="camera" />
                  </View>
                }
              </TouchableOpacity>

              <Text style={styles.Txt869}>Upload SIP</Text>
              <TouchableOpacity style={styles.Nama_lengkap} onPress={(uploadSIP && updateData) ? () => handleChoosePhoto('SIP') : null}>
                {thumbSIP !== '' ?
                  <Image
                    style={styles.uploadImage}
                    source={{uri: thumbSIP}}
                    resizeMode="contain"
                  />
                  :
                  <View style={styles.uploadImage}>
                    <Icons color="rgba(0,0,0,1)" label="Kamera" name="camera" />
                  </View>
                }
              </TouchableOpacity>

              {updateData ?
                <TouchableOpacity onPress={onSubmit}>
                  <View style={styles.Btn_lanjut}>
                    <Text style={styles.Txt760}>SIMPAN</Text>
                  </View>
                </TouchableOpacity>
                :
                <></>
              }
            </View>
          </View>
          <View>
            {showAlertBox()}
          </View>
        </ScrollView>
      </SafeAreaView>
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
  },

  Group326: {
    paddingVertical: 26,
  },

  Nama_lengkap: {
    marginBottom: 10,
    borderRadius: 20,
  },
  Form_pass_lama: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
    height: 40,
  },

  Txt346: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
    //width: 261,
  },

  Txt869: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
  },

  Group0401: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: '5%',
  },
  Group040: {
    marginHorizontal: 20,
  },
  Txt279: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 12,
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
  },
  Txt798: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 12,
    color: 'rgba(0,0,0,1)',
    width: 261,
    height: 13,
  },

  Useravatar: {
    width: 98,
    height: 98,
    borderRadius: 100,
    marginBottom: 10,
  },
  uploadImage: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(184,202,213,1)',
    height: 200,
    justifyContent: 'center',
  },

  selectOption: {
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    borderWidth: 0.2,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    marginVertical: 20,
    color: 'rgba(0,32,51,1)',
    backgroundColor: 'white',
    height: 40,
  },
  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    marginBottom: 20,
  },
  Txt760: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  containerKey: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    //marginTop: '15%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    //backgroundColor: 'rgba(36,195,142,0.5)',
    //borderRadius: 100,
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 12,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
