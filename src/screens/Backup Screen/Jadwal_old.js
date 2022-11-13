import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TextInput, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Headerjadwal from "../components/Headerjadwal";
import CupertinoButtonDelete from "../components/CupertinoButtonDelete";
import CupertinoButtonEdit from "../components/CupertinoButtonEdit";
import Btnsimpan from "../components/Btnsimpan";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import { LocaleConfig, Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';
import RNPickerSelect from 'react-native-picker-select';

//import Notifications from '../Notifications';

LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan.','Peb','Mar','Apr','Mei','Jun','Jul.','Agt','Sep.','Okt.','Nop.','Des.'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min.','Sen.','Sel.','Rab.','Kam.','Jum.','Sab'],
  today: 'Hari ini'
};
LocaleConfig.defaultLocale = 'id';

function Jadwal(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [ubahJadwal, setUbahJadwal] = useState(false);
  const [ubahJadwalKhusus, setUbahJadwalKhusus] = useState(false);
  const today = (moment(new Date()).format('YYYY-MM-DD')).toString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState('');
  const [jadwalNakes, setJadwalNakes] = useState([]);
  //const [aturJadwalPengganti, setAturJadwalPengganti] = useState(false);
  const [jadwalPengganti, setJadwalPengganti] = useState('');
  const [curr_id_jadwal, setCurr_id_jadwal] = useState('');
  const [curr_id_paket, setCurr_id_paket] = useState('');
  const [detailJadwal, setDetailJadwal] = useState('');
  const [id_detail, setId_detail] = useState('');

  const [id_jadwal_detail, setId_jadwal_detail] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [itemsJam, setItemsJam] = useState('');
  const [waktuPengganti, setWaktuPengganti] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await setCurrentDataNakes();
    if(success) {
      setRefreshing(false)
      setLoadingFetch(false);
    }else {
      setRefreshing(true);
      setLoadingFetch(true);
    }

    return () => {
      setRefreshing(false);
    }
    //wait(2000).then(() => setRefreshing(false));
  });

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

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);

    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataNakes();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  useEffect(() => {
    ubahJadwal ?
      checkJadwal(selectedDate):
      getJadwalAll();
  
    return() => {
      setLoadingFetch(false);
    }
  },[selectedDate]);

  useEffect(() => {
    listJam();

    return () => {
      setLoadingFetch(false);
    }
  },[jadwalPengganti]);

  const setCurrentDataNakes = async () => {
    //await setLoadingFetch(true);
    success = await getJadwalAll();
    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
      return(true);
    }
  }

  const dateChange = async (day) => {
    await setLoadingSave(true);
    await setWaktuPengganti('');
    let exist = false;
    
    if(ubahJadwalKhusus) {
      exist = await checkJadwalPaket(day.dateString);
      if(exist) {
        await showError('Sudah ada jadwal paket yang sama pada tanggal yang dipilih');
        await setJadwalPengganti('');
        await setLoadingSave(false);
        return;
      }
    }

    await setSelectedDate(day.dateString);

    await setLoadingSave(false);
  }

  async function checkJadwalPaket(ev) {
    const newSelectedDate = moment(ev).format('YYYY-MM-DD');
    const jadwal = detailJadwal.jadwal.filter(
      item => item.order_date === newSelectedDate
    );

    if(jadwal.length > 0) {
      return true;
    }else {
      return false;
    }
  }

  async function checkJadwal(ev) {
    setLoadingFetch(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      selectDate: moment(new Date(ev)).format('YYYY-MM-DD'),
      id_paket: curr_id_paket,
      id_jadwal: curr_id_jadwal,
      token: dataLogin.token
    });

    success = await formValidation.checkJadwal(params);
    
    if(success.status === true) {
      try {
        await setJadwalPengganti(success.res);
      } catch (error) {
        alert(error);
      } finally {
        await setLoadingFetch(false);
      }
    }
  }

  async function getJadwalAll() {
    setLoadingFetch(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      selectDate: moment(selectedDate).format('YYYY-MM-DD'),
      token: dataLogin.token
    });

    success = await formValidation.getJadwalAll(params);

    if(success.status === true) {
      await setJadwalNakes(success.res);
      await setLoadingFetch(false);
      return true;
    }
  }

  //untuk menampilkan error
  const showError = (e) => {
    showMessage({
      message: e,
      //description: "My message description",
      type: "warning",
      icon: "warning",
      //backgroundColor: "rgb(255, 195, 102)",
      color: "rgba(255,255,255,1)",
      floating:true
    });
  }

  async function handleExpand(ev) {
    setLoadingSave(true);
    const str = ev;
    const data = str.split("|");

    await setId_jadwal_detail(data[0]);
    await setCurrentDate(data[1]);
    await getDetailJadwal(ev);
  }

  async function handleExpandReg(ev) {
    setLoadingSave(true);
    const str = ev;
    const data = str.split("|");
    
    await setId_jadwal_detail(data[0]);
    await setCurrentDate(data[1]);
    //await setAturJadwalPengganti(true);
    await getDetailJadwal(ev);

    await checkJadwal(selectedDate); //new script 02-01-2022
    //setLoadingSave(false);
  }

  async function onClickEdit(ev) {
    setLoadingSave(true);
    const str = ev;
    const data = str.split("|");

    await setId_detail(data[0]);
    await setUbahJadwalKhusus(true);
    await setJadwalPengganti('');

    let params = [];
    params['id_jadwal'] = id_jadwal_detail;
    params['id_paket'] = detailJadwal.id_paket;
    await setIdPaket(params);
    setLoadingSave(false);
  }

  async function setIdPaket(ev) {
    await setCurr_id_jadwal(ev.id_jadwal);
    await setCurr_id_paket(ev.id_paket);
  }

  const getDetailJadwal = async (ev) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: ev,
      token: dataLogin.token
    });

    success = await formValidation.getDetailJadwal(params);

    if(success.status === true) {
      try {
        await setDetailJadwal(success.res);
      } catch (error) {
        alert(error);
      } finally {
        await setLoadingSave(false);
      }
    }
  }

  function listJam() {
    const newItems = jadwalPengganti;
    let rowTime = [];

    //rowTime.push({value: '', label: ''});
    if(newItems) {
      newItems.map((item, index) => {
        const jadwal = item.jadwal;
        jadwal.map((key, i) => {
          let jam = jadwal[i].jam_praktek;
          jam.sort();

          jam.map(jadwal => {
            rowTime.push({value: jadwal, label: jadwal});
          });
        })
      });
    }
    setItemsJam(rowTime);
  }

  const RenderJam = () => {
    const items = itemsJam;
    const placeholder = {
      label: 'Pilih Jam...',
      value: ''
    }; 

    if(items) {
      return (
        <RNPickerSelect
              placeholder={placeholder}
              items={items}
              onValueChange={(value) => {
                if(value !== waktuPengganti) {
                  pilihJam(value)
                }
              }}
              style={pickerSelectStyles}
              value={waktuPengganti}
              useNativeAndroidPickerStyle={false}
            />
      )
    }else {
      return (
        <></>
      )
    }
  }

  async function pilihJam(ev) {
    await setWaktuPengganti(ev);
  }

  function RenderJadwal() {
    const newItems = jadwalNakes;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_jadwal} style={styles.group}>
            <Spinner
                  size="small"
                  animation="fade"
                  visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
            <View style={styles.minimizejadwal}>
              <View style={styles.rect}>
                <View style={styles.arielTatumColumnRow}>
                  <View style={styles.arielTatumColumn}>
                    <Text style={[styles.arielTatum, {fontWeight: 'bold'}]}>{item.client}</Text>
                    <Text style={styles.arielTatum}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                    <Text style={[styles.arielTatum, {fontWeight: 'bold', color: '#FF4242'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                  </View>
                  <View style={styles.arielTatumColumnFiller}></View>
                  <CupertinoButtonDelete
                    style={styles.cupertinoButtonDelete}
                    ubahJadwal={ubahJadwal}
                    name={item.id_jadwal + '|' + item.order_date}
                    id_paket={item.id_paket}
                    onCancel={onCancel}
                    ubahJadwal={ubahJadwal}
                    setUbahJadwal={setUbahJadwal}
                    handleExpandReg={handleExpandReg}
                    handleExpand={handleExpand}
                  />
                </View>
              </View>
            </View>
          </View>
        )
      })
    }else {
      return(
        <>
          <Spinner
                  size="small"
                  animation="fade"
                  visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
        </>
      )
    }
  }

  function RenderJadwalDetail(argument) {
    const newItems = detailJadwal;

    if(newItems) {
      const jadwal = newItems.jadwal;
      return jadwal.map((item, index) => {
        return (
          (newItems.id_paket === '1') ?
          
                <View key={item.id_detail} style={styles.arielTatumColumnRow2}>
                  <Spinner
                    size="small"
                    animation="fade"
                    visible={loadingFetch}
                    textContent={''}
                    textStyle={styles.spinnerTextStyle}
                    color="#D13395"
                    overlayColor="rgba(255, 255, 255, 0.5)"
                  />
                  <View style={styles.arielTatumColumn2}>
                    <Text style={styles.arielTatum}>{moment(item.order_date).format('dddd') + ' ' + moment(item.order_date).format('DD/MM/YYYY') + ', ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                    <View style={styles.boxPengganti}>
                      <Text style={[styles.arielTatum, {marginLeft: 12}]}>Perubahan Waktu Layanan</Text>
                      <View style={styles.tglRow}>
                        <View style={styles.tgl}>
                          <View style={styles.rect3}>
                            <Text
                              style={styles.tglganti}>
                              {moment(selectedDate).format('dddd') + ", " + moment(selectedDate).format('DD/MM/YYYY')}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.jam}>
                          <View style={styles.rect4}>
                            <RenderJam />
                          </View>
                        </View>
                      </View>
                    </View>
                    <Btnsimpan
                      style={styles.cupertinoButtonSave}
                      onSubmit={onSubmit}
                    />
                  </View>
                  {/*<CupertinoButtonDelete
                    style={styles.cupertinoButtonDelete}
                    ubahJadwal={ubahJadwal}
                    name={item.id_jadwal + '|' + item.order_date}
                    id_paket={item.id_paket}
                    onCancel={onCancel}
                    ubahJadwal={ubahJadwal}
                    setUbahJadwal={setUbahJadwal}
                    handleExpandReg={handleExpandReg}
                    handleExpand={handleExpand}
                  />*/}
                </View>
          :
              <View key={item.id_detail} style={styles.arielTatumColumnRow2}>
                <Spinner
                    size="small"
                    animation="fade"
                    visible={loadingFetch}
                    textContent={''}
                    textStyle={styles.spinnerTextStyle}
                    color="#D13395"
                    overlayColor="rgba(255, 255, 255, 0.5)"
                  />
                <View style={styles.arielTatumColumn2}>
                  <Text style={styles.arielTatum}>{moment(item.order_date).format('dddd') + ' ' + moment(item.order_date).format('DD/MM/YYYY') + ', ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                    {(ubahJadwalKhusus && item.id_detail === id_detail) ?
                    <View>
                      <Text style={styles.arielTatum}>Perubahan Waktu Layanan</Text>
                      <View style={styles.tglRow}>
                        <View style={styles.tgl}>
                          <View style={styles.rect3}>
                            <Text
                              style={styles.tglganti}>
                              {moment(selectedDate).format('dddd') + ", " + moment(selectedDate).format('DD/MM/YYYY')}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.jam}>
                          <View style={styles.rect4}>
                            <RenderJam />
                          </View>
                        </View>
                      </View>
                      <Btnsimpan
                        style={styles.cupertinoButtonInfo2}
                        onSubmit={onSubmit}
                      />
                    </View>
                    :<></>}
                </View>
                <CupertinoButtonEdit
                  style={styles.cupertinoButtonEdit}
                  ubahJadwal={ubahJadwal}
                  name={item.id_detail + '|' + item.order_date}
                  id_paket={item.id_paket}
                  onCancelKhusus={onCancelKhusus}
                  ubahJadwalKhusus={ubahJadwalKhusus}
                  setUbahJadwalKhusus={setUbahJadwalKhusus}
                  onClickEdit={onClickEdit}
                  id_detail={id_detail}
                />
              </View>
              
        )
      })
    }else {
      return(
        <>
          <Spinner
                  size="small"
                  animation="fade"
                  visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
        </>
      )
    }
  }

  const onCancel = async () => {
    setLoadingSave(true);
    await setUbahJadwal(false);
    await setUbahJadwalKhusus(false);
    await setSelectedDate((moment(new Date()).format('YYYY-MM-DD')).toString());
    //await getJadwalAll();
    setLoadingSave(false);
    //(dataNakes ? setCurrentDataNakes():'');
  }

  const onCancelKhusus = async () => {
    setLoadingSave(true);
    await setUbahJadwalKhusus(false);
    await setSelectedDate((moment(new Date()).format('YYYY-MM-DD')).toString());
    setLoadingSave(false);
  }

  const onSubmit = async () => {
    //alert(dataLogin.id_nakes + " | " + selectedDate + " | " + waktuPengganti + " | " + id_jadwal_detail + " | " + detailJadwal.id_paket + " | " + id_detail);
    if(waktuPengganti === '') {
      showError('Anda belum memilih jam pengganti');
      return;
    }

    await setLoadingSave(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      selectDate: moment(selectedDate).format('YYYY-MM-DD'),
      id_jadwal: id_jadwal_detail,
      id_pasien: detailJadwal.id_pasien,
      waktuPengganti: waktuPengganti,
      id_paket: detailJadwal.id_paket,
      id_detail: id_detail,
      token: dataLogin.token,
      notif_type: 'reschedule'
    });

    success = await formValidation.saveJadwal(params);

    if(success.status === true) {
      try {
        await showError(success.res.messages);
        await onReload();
      } catch (error) {
        alert(error);
      } finally {

        //set schedule reminder 30 minutes before visit start
        let reminderTime  = new Date();
        let new_params = [];
        new_params.push({
          id: id_jadwal_detail.substring(4),
          client: jadwalNakes[0].client,
          jam: waktuPengganti.replace(':00', '.00')
        });

        reminderTime = new Date(moment(selectedDate, 'YYYY-MM-DD').format('YYYY/MM/DD') + ' ' + waktuPengganti + ':00');
        reminderTime.setHours(reminderTime.getHours()-1, reminderTime.getMinutes()+30, reminderTime.getSeconds());

        formValidation.cancelNotificationById(new_params[0].id);
        formValidation.scheduleNotification(reminderTime, new_params);
        //set schedule reminder 30 minutes before visit end

        //send notif
        success = await formValidation.sendNotif(params);

        if(success.status === true) {
          onReload();
        }else {
          onReload();
        }
        
      }
    }
  }

  async function onReload() {
    await setUbahJadwalKhusus(false);
    await setUbahJadwal(false);

    const today = (moment(new Date()).format('YYYY-MM-DD')).toString();
    await setSelectedDate(moment(new Date()).format('YYYY-MM-DD').toString());
    await setStartDate(new Date());
    await setEndDate('');
    await setJadwalNakes([]);
    await setJadwalPengganti('');
    await setCurr_id_jadwal('');
    await setCurr_id_paket('');
    await setDetailJadwal('');
    await setId_detail('');
    await setId_jadwal_detail('');
    await setCurrentDate('');
    await setItemsJam('');
    await setWaktuPengganti('');
    await setLoadingSave(false);
  }

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
            <Headerjadwal style={styles.headerjadwal} props={props}/>
            <ScrollView
                      horizontal={false}
                      contentContainerStyle={styles.scrollArea_contentContainerStyle}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      }
                    >
            <View style={styles.container}>
              <View style={styles.headerjadwalColumn}>
                  <View style={[styles.scrollArea, styles.inner]}>
                      <View style={styles.imageStack}>
                        <Calendar
                          minDate={moment(startDate).format('YYYY-MM-DD')}
                          markedDates={{
                            [selectedDate]: {selected: true, marked: true, selectedColor: '#26AFFF'},
                          }}
                          style={styles.calendar}
                          onDayPress={(day) => {dateChange(day)}}
                        />
                      </View>
                      {!ubahJadwal ?
                      <RenderJadwal />
                      :
                      !loadingSave ?
                        <View key={detailJadwal.id_jadwal} style={styles.group2}>
                          <View style={styles.maximizejadwal}>
                            <View style={styles.rect2}>
                              <View style={styles.arielTatumColumnRow}>
                                <View style={styles.arielTatumColumn2}>
                                  <Text style={[styles.arielTatum, {fontWeight: 'bold'}]}>{detailJadwal.client}</Text>
                                  <Text style={[styles.arielTatum, {fontWeight: 'bold', color: '#315DF9'}]}>{detailJadwal.order_type} {detailJadwal.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                                  <RenderJadwalDetail />
                                  {/*<Btnsimpan style={styles.cupertinoButtonInfo2}></Btnsimpan>*/}
                                </View>
                                <CupertinoButtonDelete
                                  style={styles.cupertinoButtonDelete}
                                  ubahJadwal={ubahJadwal}
                                  name={detailJadwal.id_jadwal + '|' + detailJadwal.order_date}
                                  id_paket={detailJadwal.id_paket}
                                  onCancel={onCancel}
                                  ubahJadwal={ubahJadwal}
                                  setUbahJadwal={setUbahJadwal}
                                  handleExpandReg={handleExpandReg}
                                  handleExpand={handleExpand}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                        :<></>
                      }
                  </View>
              </View>
            </View>
            </ScrollView>
            <View>
                <Footer style={styles.footer1} props={props} dataLogin={dataLogin} />
            </View>
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
  container: {
    flex: 1,
    paddingBottom: '25%',
    backgroundColor: "white",
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  headerjadwal: {
    height: 75
  },
  februari2021: {
    top: 15,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    left: 0,
    right: 0,
    textAlign: "center"
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
  },
  imageStack: {
    height: 'auto',
    flex: 1,
  },
  calendar: {
    width: '100%',
    height: 'auto',
  },
  group: {
    marginTop: 5,
    height: 'auto',
    padding: 5
  },
  minimizejadwal: {
    height: 70,
  },
  rect: {
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
  },
  arielTatumColumnRow: {
    height: 'auto',
    flexDirection: "row",
    padding: 5,
  },
  arielTatumColumnRow2: {
    marginTop: 5,
    height: 'auto',
    flexDirection: "row",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
  },
  arielTatumColumn: {
    width: '100%',
  },
  arielTatumColumn2: {
    width: '100%',
  },
  arielTatum: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  arielTatumColumnFiller: {
    flex: 1,
    flexDirection: "row"
  },
  cupertinoButtonDelete: {
    height: 44,
    width: 44,
    right: 50
  },
  cupertinoButtonEdit: {
    height: 44,
    width: 44,
    top: 0,
    right: 50
  },
  group2: {
    height: 'auto',
    marginTop: 5,
    padding: 5
  },
  maximizejadwal: {
    height: 'auto',
  },
  rect2: {
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#41aadf"
  },
  tgl: {
    flex: 0.6
  },
  rect3: {
    flex: 1,
    padding: '2%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#41aadf"
  },
  tglganti: {
    fontFamily: "roboto-regular",
    color: "#121212",
    width: 135,
    marginLeft: 8,
    padding: '1%'
  },
  jam: {
    flex: 0.4,
    marginLeft: '4%'
  },
  rect4: {
    flex: 1,
    padding: '2%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#41aadf"
  },
  boxPengganti: {
    height: 'auto',
    width: '100%',
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 0,
    borderColor: "#41aadf",
    borderRadius: 10,
    backgroundColor: "white",
  },
  tglRow: {
    flexDirection: "row",
    marginTop: 8,
    marginLeft: 12,
    marginRight: 11
  },
  cupertinoButtonSave: {
    height: 36,
    borderRadius: 10,
    marginTop: 11,
  },

  cupertinoButtonInfo2: {
    height: 36,
    borderRadius: 42,
    marginTop: 11,
    marginLeft: 11,
    marginRight: 11
  },
  headerjadwalColumn: {
    height: 'auto',
    flex: 1,
  },
  headerjadwalColumnFiller: {
    flex: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    alignSelf: "stretch",
    textAlign: 'center',
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: '2%',
    backgroundColor: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    alignSelf: "stretch",
    textAlign: 'center',
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: '2%',
    backgroundColor: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Jadwal;
