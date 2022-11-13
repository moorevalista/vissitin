import React, { Component, useState, useEffect, useRef, useContext } from "react";
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
import axios from 'axios';
import Loader from '../../components/Loader';
import RNPickerSelect from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';
import IconPanah from 'react-native-vector-icons/Ionicons';

export default function EditDataProfesi(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [location, setLocation] = useState('');

  const [dataFaskes, setDataFaskes] = useState([]);
  const [itemFaskes, setItemFaskes] = useState([]);
  const [id_faskes, setId_faskes] = useState('');

  const refSertifikasi = useRef(null);
  const refCompany = useRef(null);
  const refCompany_address = useRef(null);

  const [styleSertifikasi, setstyleSertifikasi] = useState(styles.rect);
  const [styleCompany, setstyleCompany] = useState(styles.rect);
  const [styleCompany_address, setstyleCompany_address] = useState(styles.rect);


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
        //await setLoading(false);
      }
    }
  }

  const getDataNakes = async () => {
    //alert(JSON.stringify(dataLogin[0].id_nakes));
    //alert(dataLogin[0].token); return;
    axios
      .get(formValidation.base_url + "nakes/getUser/" + dataLogin.id_nakes, {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataNakes(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);

    return () => {
      setDataNakes([]);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      getDataNakes();
    }

    return () => {
      setCurrentData([]);
      setId_faskes('');
    }
  },[dataLogin]);

  useEffect(() => { //set existing data Nakes
    if(dataNakes.length !== 0) {
      setCurrentDataNakes();
    }
  }, [dataNakes]);

  useEffect(() => {
    updateData ? onUpdate():'';
  },[updateData]);

  useEffect(() => {
    listFaskes();
  }, [dataFaskes]);

  const getFaskes = async (data) => {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      token: dataLogin.token
    });

    success = await formValidation.getAllFaskes(params);

    if(success.status === true) {
      try {
        await setDataFaskes(success.res);
      } catch(error) {
        alert(error);
      } finally {

      }
    }
  }

  const listFaskes = async () => {
    const newItems = dataFaskes.data;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_faskes, label: item.faskes_name}
        )
      });
    }

    setItemFaskes(options);
  }

  const RenderFaskes = () => {
    const items = itemFaskes;
    const placeholder = {
      label: 'Pilih Faskes...',
      value: null
    };
    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== id_faskes) {
            setId_faskes(value)
            onChange(value, 'id_faskes')
          }
        }}
        style={pickerSelectStyles}
        value={id_faskes}
        useNativeAndroidPickerStyle={true}
      />
    )
  }

  const setCurrentDataNakes = async () => {
    await setLoading(true);
    await setCurrentData(dataNakes.data);
    await setId_faskes(dataNakes.data.id_faskes);
    await getFaskes();
    await setLoading(false);
  }

  const onUpdate = async () => {
    let params = [];
    params.push({
      sertifikasi: currentData.sertifikasi,
      id_faskes: currentData.id_faskes,
      //company: currentData.company,
      //company_address: currentData.company_address,
      //company_address_detail: currentData.company_address_detail,
      //company_lat: currentData.company_lat,
      //company_lon: currentData.company_lon,
      about_me: currentData.about_me
    });
    await setNewData(params);
  }

  const onChange = async (ev, key) => {
    //alert(JSON.stringify(newData));
    let params = [];
    let inputData = [ ...newData ];
    inputData[0] = {...inputData[0], [key]: ev};
    //alert(JSON.stringify(inputData));
    params.push(inputData[0]);
    await setNewData(params);
  }

  const onSubmit = async () => {
    if(handleValidSubmit()) {
      setLoadingSave(true);
//      const geoLocation = await getLocationByAddress(newData[0].company + ', ' + newData[0].company_address + '(' + newData[0].company_address_detail + ')');
      //console.log(JSON.stringify(geoLocation));

//      if (geoLocation.code === undefined) {
//        if((geoLocation.lat !== '' && geoLocation.lat !== null) && (geoLocation.lng !== '' && geoLocation.lng !== null)) {
          const formData = new FormData();
          formData.append("sertifikasi", newData[0].sertifikasi);
          formData.append("id_faskes", newData[0].id_faskes);
          /*formData.append("company", newData[0].company);
          formData.append("company_address", newData[0].company_address);
          formData.append("company_address_detail", newData[0].company_address_detail);
          formData.append("company_lat", geoLocation.lat);
          formData.append("company_lon", geoLocation.lng);*/
          formData.append("about_me", newData[0].about_me);
          formData.append("token", dataLogin.token);

          axios
            .post(formValidation.base_url + "nakes/updateDataPengalamanNakes/" + dataNakes.data.en_id_nakes, formData)
            .then((res =>{
              setLoadingSave(false);
              if(res.data.responseCode !== "000") {
                formValidation.showError((res.data.messages[0] !== undefined && res.data.messages[0].length > 1) ? res.data.messages[0] : res.data.messages);
              }else {
                setUpdateData(false);
                formValidation.showError('Data berhasil disimpan...');

                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [
                      {
                        name: 'MainApp',
                        params: { base_url: formValidation.base_url },
                      },
                      {
                        name: 'settingScreen',
                        params: { base_url: formValidation.base_url },
                      }
                    ],
                  })
                )
              }
            }))
            .catch(error => {
              setLoadingSave(false);
              if(error.response != undefined && error.response.status == 404) {
                formValidation.showError('Terjadi kesalahan...');
              }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
                formValidation.showError(error.response.data.messages.error);
              }else {
                formValidation.showError(error);
              }
            })
      /*  }else {
          setLoadingSave(false);
          formValidation.showError('Gagal mendapatkan lokasi, pastikan GPS anda aktif dan periksa kembali detail lokasi yang anda isi');
        }
      } else {
        setLoadingSave(false);
        formValidation.showError('Gagal mendapatkan lokasi, pastikan GPS anda aktif dan periksa kembali detail lokasi yang anda isi');
      }*/
      
    }
  }

  const onCancel = async () => {
    //alert(birth_date);
    setCurrentDataNakes();
    setUpdateData(!updateData);
    //(dataNakes ? setCurrentDataNakes():'');
  }

  function getLocationByAddress(ev) {
    success = formValidation.getLocationByAddress(ev);
    //alert(JSON.stringify(success));
    setLocation(success);
    return(success);
  }

  const handleValidSubmit = () => {
    let isValid = true;
    let errorMsg = {};

    if(newData[0].sertifikasi === '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      refSertifikasi.current.focus();
      setstyleSertifikasi(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleSertifikasi(styles.rect);
    }

    if(newData[0].id_faskes === '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      setstyleCompany(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleCompany(styles.rect);
    }

    /*if(newData[0].company === '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      refCompany.current.focus();
      setstyleCompany(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleCompany(styles.rect);
    }

    if(newData[0].company_address == '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      refCompany_address.current.focus();
      setstyleCompany_address(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleCompany_address(styles.rect);
    }*/

    return isValid;
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
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
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={() => null} />
            }>
            <View style={styles.Group326}>
              <View style={styles.Group0401}>
                <Text style={styles.Txt279}>
                  Lengkapi data profesi kamu untuk memudahkan kami dalam proses
                  verifikasi legalitas kamu.
                </Text>

                <View style={{width: '100%'}}>
                  <TouchableOpacity style={[styles.Tbl_iconPanah]} onPress={!updateData ? () => setUpdateData(!updateData) : onCancel}>
                    {!updateData ?
                      <Icons color="rgba(0,0,0,1)" label="Panah" name="create" />
                      :
                      <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.Group040}>
                {/*<View style={styles.Nama_lengkap}>
                  <Text style={styles.Txt869}>Pendidikan</Text>
                  <View style={styles.Form_pass_lama}>
                    <TextInput
                      style={styles.Txt346}
                      placeholder="*Pendidikan"
                      editable={false}
                      value={currentData.pendidikan}
                    />
                  </View>
                </View>
                <View style={styles.Nama_lengkap}>
                  <Text style={styles.Txt869}>*Profesi</Text>
                  <View style={styles.Form_pass_lama}>
                    <TextInput
                      style={styles.Txt346}
                      placeholder="*Profesi"
                      editable={false}
                      defaultValue={currentData.profesi}
                    />
                  </View>
                </View>*/}

                <View style={styles.Nama_lengkap}>
                  <Text style={styles.Txt869}>Sertifikasi Keahlian</Text>
                  <View style={styles.Form_pass_lama}>
                    <TextInput
                      style={styles.Txt346}
                      placeholder="Sertifikasi Keahlian"
                      editable={updateData}
                      autoCapitalize="words"
                      onChangeText={(e) => onChange(e, 'sertifikasi')}
                      ref={refSertifikasi}
                      defaultValue={currentData.sertifikasi}
                    />
                  </View>
                </View>
                <View style={styles.Nama_lengkap} pointerEvents={!updateData ? 'none':'auto'}>
                  <Text style={styles.Txt869}>Tempat Kerja Sekarang</Text>
                  <View style={styles.Form_pass_lama}>
                    <RenderFaskes />
                  </View>
                </View>
                {/*<View style={styles.Nama_lengkap}>
                  <Text style={styles.Txt869}>Alamat Tempat Kerja</Text>
                  <View style={styles.Box(updateData)}>
                    <TextInput
                      multiline={true}
                      style={styles.Txt346}
                      placeholder="Alamat Tempat Kerja"
                      maxLength={255}
                      editable={updateData}
                      autoCapitalize="words"
                      onChangeText={(e) => onChange(e, 'company_address')}
                      ref={refCompany_address}
                      defaultValue={currentData.company_address}
                    />
                  </View>
                </View>
                <View style={styles.Nama_lengkap}>
                  <Text style={styles.Txt869}>Detail Alamat Tempat Kerja</Text>
                  <View style={styles.Box(updateData)}>
                    <TextInput
                      multiline={true}
                      style={styles.Txt346}
                      placeholder={"Contoh : No. Rumah/Apartemen, RT/RW, Acuan \n(Boleh dikosongkan)"}
                      maxLength={255}
                      editable={updateData}
                      autoCapitalize="words"
                      onChangeText={(e) => onChange(e, 'company_address_detail')}
                      defaultValue={currentData.company_address_detail}
                    />
                  </View>
                </View>*/}
                <View style={styles.Nama_lengkap}>
                  <Text style={styles.Txt869}>Deskripsi Tentang Saya</Text>
                  <View style={styles.Box}>
                    <TextInput
                      multiline={true}
                      style={styles.Txt346}
                      placeholder="Deskripsi Tentang Saya"
                      maxLength={1000}
                      editable={updateData}
                      autoCapitalize="sentences"
                      onChangeText={(e) => onChange(e, 'about_me')}
                      defaultValue={currentData.about_me}
                    />
                  </View>
                </View>
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
          </ScrollView>
        </SafeAreaView>
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
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },

  Group326: {
    paddingVertical: 26,
  },

  Nama_lengkap: {
    marginBottom: 10,
    borderRadius: 20,
  },
  // Form_pass_lama: updateData => ({
  //   paddingHorizontal: 10,
  //   justifyContent: 'center',
  //   borderRadius: 20,
  //   backgroundColor: updateData ? 'rgba(255, 255, 255, 1)' : 'rgba(0,66,105,0.2)',
  //   borderWidth: 1,
  //   borderStyle: 'solid',
  //   borderColor: 'rgba(184,202,213,1)',
  //   height: 40,
  // }),
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
  // Box: updateData => ({
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'flex-start',
  //   paddingHorizontal: 10,
  //   paddingVertical: 10,
  //   borderRadius: 20,
  //   backgroundColor: updateData ? 'rgba(255, 255, 255, 1)' : 'rgba(0,66,105,0.2)',
  //   borderWidth: 1,
  //   borderStyle: 'solid',
  //   borderColor: 'rgba(0,66,105,0.28)',
  //   height: 80
  // }),
  Box: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)' ,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,66,105,0.28)',
    height: 80
  },

  Txt346: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
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
    marginBottom: 20,
  },
  Group040: {
    marginHorizontal: 20,
  },
  Txt279: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 1)',
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
    height: 200,
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
    //height: 'auto',
    paddingVertical: 10,
    alignSelf: "stretch",
    //marginBottom: 10,
    //borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "transparent",
    //fontSize: 14,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    //height: 30,
    paddingVertical: 10,
    alignSelf: "stretch",
    //marginBottom: 10,
    //borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "transparent",
    //fontSize: 14,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
