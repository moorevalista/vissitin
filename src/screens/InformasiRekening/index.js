import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment/min/moment-with-locales';
import axios from 'axios';
import Loader from '../../components/Loader';
import RNPickerSelect from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';
import IconPanah from 'react-native-vector-icons/Ionicons';

export default function InformasiRekening(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [kode_bank, setKode_bank] = useState('');
  const [account_number,setAccount_number] = useState('');

  const [dataBank, setDataBank] = useState([]);
  const [itemsBank ,setItemsBank] = useState([]);

  //style box textInput
  const [styleBoxKodeBank, setStyleBoxKodeBank] = useState(styles.textInput);
  const [styleBoxAccNumber, setStyleBoxAccNumber] = useState(styles.textInput);

  const refAccNumber = useRef(null);

  const getDataNakes = async () => {
    axios
      .get(formValidation.base_url + "nakes/getUser/" + dataLogin.id_nakes, {params: {token: dataLogin.token}})
      .then(res => {
        setDataNakes(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
  //     props.route.params.onRefresh();
  //   });

  //   return () => {
  //     unsubscribe;
  //   }
  // }, [props.navigation]);

  useEffect(() => {
    setDataLogin(props.route.params.dataLogin);

    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      getDataNakes();
    }
  },[dataLogin]);

  useEffect(() => { //set existing data Nakes
    if(dataNakes) {
      setCurrentDataNakes();
    }
  }, [dataNakes]);

  useEffect(() => { //trigger render listBank
    listBank();
  }, [dataBank]);

  const setCurrentDataNakes = async () => {
    await setLoading(true);
    await setKode_bank(dataNakes.data.kode_bank);
    await setAccount_number(dataNakes.data.account_number);
    await getBank();
    await setLoading(false);
  }

  //fetch list Bank
  const getBank = async () => {
    let params = [];
    params.push({ base_url: formValidation.base_url });

    success = await formValidation.getBank(params);
    
    if(success.status === true) {
      try {
        await setDataBank(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  //set listBank dari dataset Bank
  const listBank = async () => {
    const newItems = dataBank;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.kode_bank, label: item.nama_bank}
        )
      });
    }

    setItemsBank(options);
  }

  const RenderBank = () => {
    const items = itemsBank;
    const placeholder = {
      label: 'Pilih Bank...',
      value: null
    };
    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== kode_bank) {
            setKode_bank(value)
          }
        }}
        style={pickerSelectStyles}
        value={kode_bank}
        useNativeAndroidPickerStyle={true}
      />
    )
  }

  //validasi no hp
  const onChangeAccNumber = (e) => {
    val = formValidation.onChangeAccNumber(account_number, e);
    setAccount_number(val);
  }

  //set textInput style ketika inputan tidak sesuai
  const setStyleError = (e) => {
    if(e.kode_bank !== '') {
      setStyleBoxKodeBank(styles.textInputError);
    }else {
      setStyleBoxKodeBank(styles.textInput);
    }
    if(e.account_number !== '') {
      setStyleBoxAccNumber(styles.textInputError);
    }else {
      setStyleBoxAccNumber(styles.textInput);
    }
  }

  const handleSubmit = async () => {
    let paramsData = [];
    paramsData.push({
      kode_bank: kode_bank,
      account_number: account_number
    });

    val = formValidation.handlePreSubmitRekening(paramsData);

    if(val.status === false) {
      setStyleError(val);
      if(val.kode_bank !== '') {
        formValidation.showError(val.kode_bank);
      }else if(val.account_number !== '') {
        formValidation.showError(val.account_number);
      }
      //alert(JSON.stringify(val));
    }else if(val.status === true) {
      setLoadingSave(true);
      const formData = new FormData();
      formData.append("kode_bank", kode_bank);
      formData.append("account_number", account_number);
      formData.append("token", dataLogin.token);

      axios
      .post(formValidation.base_url + "nakes/updateRekening/" + dataNakes.data.en_id_nakes, formData)
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
    }
  }

  const onCancel = async () => {
    //alert(birth_date);
    setUpdateData(!updateData);
    (dataNakes ? setCurrentDataNakes():'');
  }

  // untuk icon
  const Icons = ({label, name, color}) => {
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
  };

  return (
    !loading ?
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
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
          contentContainerStyle={styles.scrollArea_contentContainerStyle}
        >
          <View style={styles.Ganti_password}>
            <View style={styles.Group7109}>
              <View style={styles.Group0401}>
                <Text style={styles.Txt279}>
                  Lengkapi data informasi rekening kamu untuk dapat melakukan
                  transaksi.
                </Text>
              </View>

              <View style={{width: '100%'}}>
                <TouchableOpacity style={[styles.Tbl_iconPanah]} onPress={!updateData ? () => setUpdateData(!updateData) : onCancel}>
                  {!updateData ?
                    <Icons color="rgba(0,0,0,1)" label="Panah" name="create" />
                    :
                    <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                  }
                </TouchableOpacity>
              </View>

              <View style={styles.Pass_lama}>
                <Text style={styles.Txt841}>*Wajib diisi</Text>
                <View style={styles.Form_pass_lama} pointerEvents={!updateData ? 'none':'auto'}>
                  <RenderBank />
                </View>
              </View>
              <View style={styles.Pass_lama}>
                <TextInput
                  style={styles.Form_pass_lama}
                  placeholder="*No.Rekening"
                  keyboardType="numeric"
                  value={account_number}
                  onChangeText={onChangeAccNumber}
                  maxLength={20}
                  ref={refAccNumber}
                  editable={updateData}
                />
              </View>
              {/*<View style={styles.Pass_lama}>
                <TextInput
                  style={styles.Form_pass_lama}
                  placeholder="*Nama Pemilik Rekening"
                />
              </View>*/}
              {updateData ?
                <TouchableOpacity onPress={handleSubmit}>
                  <View style={styles.Btn_lanjut}>
                    <Text style={styles.Txt365}>SIMPAN</Text>
                  </View>
                </TouchableOpacity>
                :
                <></>
              }
            </View>
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
  containerKey: {
    flex: 1,
    backgroundColor: "white",
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

  Ganti_password: {
    flex: 1,
  },

  Group7109: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 25,
    paddingHorizontal: 25,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Pass_lama: {
    flexDirection: 'column',
    paddingBottom: 15,
  },
  Txt841: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    paddingBottom: 5,
  },

  Form_pass_lama: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(184,202,213,1)',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt365: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Tips_pass: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  Txt047: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    marginBottom: 9,
  },
  Txt452: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(79,92,99,1)',
    textAlign: 'justify',
    paddingLeft: 10,
  },
  Group0401: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  Txt279: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 1)',
    textAlign: 'center',
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
