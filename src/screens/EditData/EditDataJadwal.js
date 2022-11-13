import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  TextInput,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import IconPanah from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import Loader from '../../components/Loader';
import CompJadwal from "../../components/CompJadwal";
import { CommonActions } from '@react-navigation/native';

export default function EditDataJadwal(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [jadwalExist, setJadwalExist] = useState([]);
  const [jamPilihan, setJamPilihan] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        
      }
    }
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
      setCurrentDataNakes();
    }

    return () => {
      setLoadingSave(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(jadwalExist) {
      setCurrJadwalExist();
    }

    return () => {
      setLoadingSave(false);
    }
  },[jadwalExist]);

  useEffect(() => {
    refreshing ? setCurrentDataNakes() : '';

    return () => {
      setLoadingSave(false);
    }
  },[refreshing]);

  const setDefaultJamPilihan = async () => {
    await setJamPilihan(
      {
        senin: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        selasa: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        rabu: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        kamis: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        jumat: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        sabtu: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        minggu: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
      }
    )
  }

  const setCurrentDataNakes = async () => {
    await setDefaultJamPilihan();
    await setLoading(true);
    await getJadwalNakes();
    //await setCurrJadwalExist();
    await setLoading(false);
  }

  const getJadwalNakes = async () => {
    let params = [];
    params.push({ base_url: formValidation.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.getJadwalNakes(params);

    if(success.status === true) {
      try {
        await setJadwalExist(success.res);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  async function setCurrJadwalExist() {
    //alert(JSON.stringify(jadwalExist));
    const newItems = jadwalExist;
    let newJamPilihan = { ...jamPilihan };
    let shift = '';
    let jadwal = '';

    if(newItems !== null) {
      newItems.map((item, i) => {
        let hari = newItems[i];
        //console.log(hari);
        Object.keys(hari).map((key, i) => { //key = senin, selasa dst
          shift = hari[key];
          Object.keys(shift).map((keys, i) => {
            jadwal = shift[keys];
            Object.keys(jadwal).map((keyName, i) => { //keyName = pagi, sore
              newJamPilihan[key][keyName]['awal'] = jadwal[keyName]['awal'];
              newJamPilihan[key][keyName]['akhir'] = jadwal[keyName]['akhir'];

              newJamPilihan[key][keyName]['active'] = jadwal[keyName]['active'] === '1' ? true : false;

              setJamPilihan(newJamPilihan);
            })
          })
        })
      })
    }
  }

  async function handleChangeJadwal(e, name, shift) {
    //let checked = e ? '1' : '0';

    if(shift === 'pagi') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: e},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: jamPilihan[name].sore.active}
                              }
                            };
      await setJamPilihan(newJamPilihan);
    }else if(shift === 'sore') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: e}
                              }
                            };
      await setJamPilihan(newJamPilihan);
    }
    //alert(JSON.stringify(newJamPilihan));
  }

  async function handleChangeJamAwal(id, name, e) {
    //alert(e);
    let value = e;
    if(id === 'pagi') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: value, akhir: '', active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }else if(id === 'sore') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: jamPilihan[name].pagi.active},
                                        sore: {awal: value, akhir: '', active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }
    //alert(JSON.stringify(jamPilihan));
  }

  async function handleChangeJamAkhir(id, name, e) {
    let value = e;
    if(id === 'pagi') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: value, active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }else if(id === 'sore') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: value, active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }
  }

  const handleValidSubmit = () => {
    let isValid = true;
    let errorMsg = {};

    const waktu = jamPilihan;

    Object.keys(jamPilihan).map((keyHari, i) => { //keyHari = senin, selasa dst
      let jamPagiAwal = (jamPilihan[keyHari]['pagi']['awal']);
      let jamPagiAkhir = (jamPilihan[keyHari]['pagi']['akhir']);
      let jamSoreAwal = (jamPilihan[keyHari]['sore']['awal']);
      let jamSoreAkhir = (jamPilihan[keyHari]['sore']['akhir']);

      if(((jamPagiAwal !== '' && jamPagiAkhir === '') || (jamPagiAwal === '' && jamPagiAkhir !== '')) || ((jamSoreAwal !== '' && jamSoreAkhir === '') || (jamSoreAwal === '' && jamSoreAkhir !== ''))) {
        isValid = false;
      }
    })
    return isValid;
  }

  const onCancel = async () => {
    await setUpdateData(!updateData);
    onRefresh();
  }

  const onSubmit = async () => {
    if(handleValidSubmit()) {
      setLoadingSave(true);

      const formData = new FormData();
      formData.append("id_nakes", dataLogin.id_nakes);
      formData.append("jamPilihan", JSON.stringify(jamPilihan));
      formData.append("token", dataLogin.token);

      axios
      .post(formValidation.base_url + "nakes/saveJadwalNakes/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res => {
        //alert(JSON.stringify(res)); return;
        if(res.data.responseCode !== '000') {
          formValidation.showError((res.data.messages[0] !== undefined && res.data.messages[0].length > 1) ? res.data.messages[0] : res.data.messages);
        }else {
          setUpdateData(false);
          formValidation.showError('Data berhasil disimpan...');
          //onRefresh();
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
        }
        setLoadingSave(false);
      }))
      .catch(error => {
        setLoadingSave(false);
        //alert((error)); return;
        if(error.response != undefined && error.response.status == 404) {
          formValidation.showError('Terjadi kesalahan...');
        }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
          formValidation.showError(error.response.data.messages.error);
        }else {
          formValidation.showError(error);
        }
      })
    }else {
      formValidation.showError('Gagal menyimpan jadwal, silahkan periksa kembali jadwal yang ingin disimpan.');
    }
  }


  const [date, setDate] = useState(new Date());
  const [tgl, setTgl] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState('');

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 28,
            opacity: 0.8,
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
        <>
          <Spinner
            visible={loadingSave}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
            color="#236CFF"
            overlayColor="rgba(255, 255, 255, 0.5)"
          />
          <SafeAreaView style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
            >
              <View style={styles.Layanan_reservasi_waktu}>
                <View style={styles.Waktu_tgl}>
                  <View style={styles.Group0401}>
                    <Text style={styles.Txt279}>
                      Atur jadwal layanan berdasarkan hari dan jam layanan kamu untuk
                      menerima jadwal reservasi.
                    </Text>

                    <View style={{width: '100%', marginTop: 20}}>
                      <TouchableOpacity style={[styles.Tbl_iconPanah]} onPress={!updateData ? () => setUpdateData(!updateData) : onCancel}>
                        {!updateData ?
                          <Icons color="rgba(0,0,0,1)" label="Panah" name="create" />
                          :
                          <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                        }
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{paddingHorizontal: 20}}>
                    <Text style={styles.Txt973}>PILIH JAM PENCARIAN</Text>
                    <CompJadwal
                      name="senin"
                      label="Senin"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />
                    <CompJadwal
                      name="selasa"
                      label="Selasa"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />
                    <CompJadwal
                      name="rabu"
                      label="Rabu"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />
                    <CompJadwal
                      name="kamis"
                      label="Kamis"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />
                    <CompJadwal
                      name="jumat"
                      label="Jumat"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />
                    <CompJadwal
                      name="sabtu"
                      label="Sabtu"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />
                    <CompJadwal
                      name="minggu"
                      label="Minggu"
                      handleChangeJadwal={handleChangeJadwal}
                      handleChangeJamAwal={handleChangeJamAwal}
                      handleChangeJamAkhir={handleChangeJamAkhir}
                      jadwalExist={jadwalExist}
                      jamPilihan={jamPilihan}
                      updateData={updateData}
                    />

                    {updateData ?
                      <TouchableOpacity
                        onPress={onSubmit}>
                        <View style={styles.Btn_lanjut}>
                          <Text style={styles.Txt1077}>SIMPAN</Text>
                        </View>
                      </TouchableOpacity>
                      :
                      <></>
                    }
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </>
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
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
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

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_reservasi_waktu: {
    display: 'flex',
    flexDirection: 'column',
  },

  Txt117: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Waktu_tgl: {
    display: 'flex',
    flexDirection: 'column',
    //paddingHorizontal: '5%',
    paddingTop: 25,
  },
  Maps: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    paddingTop: 25,
  },
  Txt973: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    marginBottom: 9,
  },
  Pilih_tanggal: {
    display: 'flex',
    flexDirection: 'column',
  },

  Txt197: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(0,32,51,1)',
    marginRight: 10,
  },
  Button: {
    width: 40,
    height: 40,
  },

  Txt705: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    marginBottom: 9,
  },
  Group728: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  Box1: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,66,105,0.28)',
  },
  Txt610: {
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(0,32,51,1)',

    marginRight: 10,
  },
  Button: {
    width: 40,
    height: 40,
  },

  Txt898: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  Button: {
    width: 40,
    height: 40,
  },

  Txt229: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(0,0,0,1)',
    width: 161,
    height: 21,
  },

  Radio_alamat_utama: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: -8,
  },

  Txt185: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 19,
    color: 'rgba(0,0,0,1)',
  },

  Radio_geotag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 300,
  },
  Ellipse32: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,1)',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },

  Group062: {
    borderRadius: 20,
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  Txt853: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    paddingTop: 10,
    textAlign: 'center',
  },

  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt1077: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Checkbox_pribadi: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
  },
  Group0401: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: '5%',
  },
  Txt279: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 1)',
    textAlign: 'center',
  },
});
