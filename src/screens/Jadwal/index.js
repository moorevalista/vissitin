import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';

import CupertinoButtonDelete from "../../components/CupertinoButtonDelete";
import CupertinoButtonEdit from "../../components/CupertinoButtonEdit";
import Btnsimpan from "../../components/Btnsimpan";
import FooterListener from '../../FooterListener';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import { LocaleConfig, Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment/min/moment-with-locales';
//import 'moment/locale/id';
import Loader from '../../components/Loader';
import RNPickerSelect from 'react-native-picker-select';

// LocaleConfig.locales['id'] = {
//   monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
//   monthNamesShort: ['Jan.','Peb','Mar','Apr','Mei','Jun','Jul.','Agt','Sep.','Okt.','Nop.','Des.'],
//   dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
//   dayNamesShort: ['Min.','Sen.','Sel.','Rab.','Kam.','Jum.','Sab'],
//   today: 'Hari ini'
// };
// LocaleConfig.defaultLocale = 'id';

export default function Jadwal(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

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

  const [currentId, setCurrentId] = useState('');

  //limit parameter for date & time select
  const [currTime, setCurrTime] = useState('');

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
    success = await formValidation.getCurrentLoginData();

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
    getLoginData();
    //setDataLogin(props.route.params.dataLogin);

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
    const today = new Date();
    const time = today.getHours();

    await setCurrTime(time);

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
        await formValidation.showError('Sudah ada jadwal paket yang sama pada tanggal yang dipilih');
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
      base_url: formValidation.base_url,
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
      base_url: formValidation.base_url,
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
  // const showError = (e) => {
  //   showMessage({
  //     message: e,
  //     //description: "My message description",
  //     type: "warning",
  //     icon: "warning",
  //     //backgroundColor: "rgb(255, 195, 102)",
  //     color: "rgba(255,255,255,1)",
  //     floating:true
  //   });
  // }

  async function checkPayment(ev) {
    const str = ev;
    const data = str.split("|");

    const newItems = jadwalNakes.filter(
      item => item.id_jadwal === data[0]
    );

    if(newItems[0].payment_type === 'Online' && newItems[0].payment_state === 'OPEN') {
      return false;
    }else {
      return true;
    }
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
      base_url: formValidation.base_url,
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

          let jam_awal = ''
          if(moment(startDate).format('YYYY/MM/DD') === moment(selectedDate).format('YYYY/MM/DD')){
            jam_awal = currTime + 3;
            if(jam_awal < 10) {
              jam_awal = '0' + jam_awal + '.00';
            }else {
              jam_awal = jam_awal + '.00';
            }

            if(jam_awal > 24) {
              jam_awal = '24.00';
            }
          }

          jam.map(jadwal => {
            if(jadwal >= jam_awal) {
              rowTime.push({value: jadwal, label: jadwal});
            }
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
          <View key={item.id_jadwal} style={styles.Layanan_reservasi_pesan}>
            <Spinner
              size="small"
              animation="fade"
              visible={loadingFetch}
              textContent={''}
              textStyle={styles.spinnerTextStyle}
              color="#D13395"
              overlayColor="rgba(255, 255, 255, 0.5)"
            />
            {/*<TouchableOpacity onPress={() => refJadwalLayanan.current.open()}>*/}
            <View>
              <View style={styles.Chat_label}>
                {/*<Image
                  style={styles.Rectangle2}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                  }}
                />*/}
                <View style={styles.Blockpesan}>
                  <Text style={styles.Txt011}>{item.client}</Text>
                  <Text style={styles.Txt137}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
                  <Text style={styles.Txt137}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                </View>
                <CupertinoButtonDelete
                  style={styles.cupertinoButtonDelete}
                  name={item.id_jadwal + '|' + item.order_date}
                  id_paket={item.id_paket}
                  onCancel={onCancel}
                  ubahJadwal={ubahJadwal}
                  setUbahJadwal={setUbahJadwal}
                  handleExpandReg={handleExpandReg}
                  handleExpand={handleExpand}
                  setCurrentId={setCurrentId}
                  currentId={currentId}
                  checkPayment={checkPayment}
                />
              </View>
            {/*</TouchableOpacity>*/}
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

  function RenderJadwalDetail() {
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

            <View style={styles.rect3}>
              <Text style={[styles.arielTatum, {fontWeight: 'bold'}]}>Jadwal Saat Ini</Text>
              <View style={styles.arielTatumColumn2}>
                <View style={styles.tglRow}>
                  <Text style={styles.arielTatum}>{moment(item.order_date).format('dddd') + ' ' + moment(item.order_date).format('DD/MM/YYYY') + ', ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.rect3, {marginTop: '5%'}]}>
              <Text style={[styles.arielTatum, {fontWeight: 'bold'}]}>Jadwal Baru</Text>
              <View style={styles.arielTatumColumn2}>
                <View style={styles.tglRow}>
                  <View style={styles.tgl}>
                    <Text style={styles.tglganti}>
                      {moment(selectedDate).format('dddd') + ", " + moment(selectedDate).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                  
                  <View style={styles.jam}>
                    <RenderJam />
                  </View>
                </View>
              </View>
            </View>
            <Btnsimpan
              style={styles.cupertinoButtonSave}
              onSubmit={onSubmit}
            />

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
              <Text style={styles.arielTatum}>{moment(item.order_date).format('dddd') + ' ' + moment(item.order_date).format('DD/MM/YYYY') + ', ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
                {(ubahJadwalKhusus && item.id_detail === id_detail) ?
                <View style={[styles.rect3, {marginTop: '5%'}]}>
                  <Text style={[styles.arielTatum, {fontWeight: 'bold'}]}>Jadwal Baru</Text>
                  <View style={styles.tglRow}>
                    <View style={styles.tgl}>
                      <Text style={styles.tglganti}>
                        {moment(selectedDate).format('dddd') + ", " + moment(selectedDate).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                    
                    <View style={styles.jam}>
                      <RenderJam />
                    </View>
                  </View>
                </View>
                :<></>}
            </View>

            {(ubahJadwalKhusus && item.id_detail === id_detail) ?
              <Btnsimpan
                style={styles.cupertinoButtonSave}
                onSubmit={onSubmit}
              />
              :
              <></>
            }

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
    await setCurrentId('');
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
      formValidation.showError('Anda belum memilih jam pengganti');
      return;
    }

    await setLoadingSave(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
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
        await formValidation.showError(success.res.messages);
        await onReload();
      } catch (error) {
        alert(error);
      } finally {

        //set schedule reminder 30 minutes before visit start
        let reminderTime  = new Date();
        let new_params = [];
        new_params.push({
          id: id_jadwal_detail.substring(4),
          client: jadwalNakes[0].service_user === 'self' ? jadwalNakes[0].client : jadwalNakes[0].nama_kerabat,
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

  const refJadwalLayanan = useRef();

  const [date, setDate] = useState(new Date());
  const [tgl, setTgl] = useState('');
  const [open, setOpen] = useState(false);

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
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
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
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
                  <View key={detailJadwal.id_jadwal} style={styles.Layanan_reservasi_pesan}>
                    <View style={styles.Chat_label}>
                      <View style={styles.Blockpesan}>
                        <View style={styles.arielTatumColumnRow}>
                          <View style={styles.arielTatumColumn2}>
                            <Text style={styles.Txt011}>{detailJadwal.client}</Text>
                            <Text style={styles.Txt137}>{detailJadwal.order_type} {detailJadwal.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                            <RenderJadwalDetail />
                            {/*<Btnsimpan style={styles.cupertinoButtonInfo2}></Btnsimpan>*/}
                          </View>
                        </View>
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
                  :
                  <></>
                }

                {/*<View style={styles.Layanan_reservasi_pesan}>
                  <TouchableOpacity onPress={() => refJadwalLayanan.current.open()}>
                    <View style={styles.Chat_label}>
                      <Image
                        style={styles.Rectangle2}
                        source={{
                          uri: 'https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/uf6kj841fyq-60%3A7495?alt=media&token=fe3e9fcc-2e4f-4b37-9e31-2027ee1c788e',
                        }}
                      />
                      <View style={styles.Blockpesan}>
                        <Text style={styles.Txt011}>Qoryatullistya, SST. FT</Text>
                        <Text style={styles.Txt137}>08:51:22 28-05-2022</Text>
                        <Text style={styles.Txt137}>
                          Anda sudah terhubung dengan nakes...
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>*/}
              </ScrollView>

              <RBSheet
                ref={refJadwalLayanan}
                closeOnDragDown={false}
                closeOnPressMask={false}
                animationType="fade"
                customStyles={{
                  wrapper: {
                    backgroundColor: 'transparent',
                  },
                  container: {
                    backgroundColor: 'rgba(67, 169, 221, 1)',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: '30%',
                  },
                  draggableIcon: {
                    backgroundColor: 'transparent',
                  },
                }}>
                <View style={styles.Email_bantuan}>
                  <View style={styles.wrapperJangan}>
                    <View style={styles.Kirim_email}>
                      <Text style={styles.multiple}>Jadwal Layanan Aktif</Text>
                      <Text style={styles.multiple1}>
                        Jadwal ini dapat anda sesuaikan setelah mendapatkan konfirmasi
                        atau persetujuan dari client anda.
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => refJadwalLayanan.current.close()}>
                      <View style={styles.Tbl_iconPanah}>
                        <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <View style={styles.Group728}>
                      <View style={styles.Box1}>
                        <TextInput
                          placeholder="Awal"
                          style={{flex: 1}}
                          allowFontScaling={false}
                          value={tgl}
                          onPressIn={() => setOpen(true)}
                          showSoftInputOnFocus={false}
                        />
                        <DatePicker
                          mode="date"
                          modal
                          is24hourSource="locale"
                          open={open}
                          date={date}
                          onDateChange={setDate}
                          onConfirm={e => {
                            setOpen(false);
                            setDate(date);
                            setTgl(moment.utc(e).format('DD/MM//YYYY'));
                          }}
                          onCancel={() => {
                            setOpen(false);
                          }}
                        />

                        <Icons label="Panah" name="calendar" />
                      </View>
                      <View style={styles.Box1}>
                        <TextInput
                          placeholder="Awal"
                          style={{flex: 1}}
                          allowFontScaling={false}
                          value={tgl}
                          onPressIn={() => setOpen(true)}
                          showSoftInputOnFocus={false}
                        />
                        <DatePicker
                          mode="date"
                          modal
                          is24hourSource="locale"
                          open={open}
                          date={date}
                          onDateChange={setDate}
                          onConfirm={e => {
                            setOpen(false);
                            setDate(date);
                            setTgl(moment.utc(e).format('DD/MM//YYYY'));
                          }}
                          onCancel={() => {
                            setOpen(false);
                          }}
                        />

                        <Icons label="Panah" name="time" />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{alignItems: 'flex-end', paddingRight: 25}}
                      onPress={() => props.navigation.navigate('DetailAntrian')}>
                      <View style={styles.Btn_tambah}>
                        <Text style={styles.Txt6105}>Simpan</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </RBSheet>
              <FooterListener props={props} dataLogin={dataLogin} />
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
    backgroundColor: 'rgba(54,54,54,1)',
  },
  scrollArea_contentContainerStyle: {
    // flex: 1,
    height: 'auto',
    paddingBottom: '2%',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  arielTatumColumnRow: {
    height: 'auto',
    flexDirection: "row",
    padding: 5,
  },
  arielTatumColumnRow2: {
    marginTop: 5,
    height: 'auto',
    flexDirection: "column",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
  },
  arielTatumColumn2: {
    flex: 1,
  },
  arielTatum: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
  },
  tglRow: {
    flexDirection: "row",
    marginTop: '2%',
  },
  tgl: {
    flex: 0.6,
    alignSelf: 'center'
  },
  rect3: {
    flex: 1,
    padding: '2%',
    //backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)"
  },
  tglganti: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    //width: 135,
    paddingHorizontal: '2%',
  },
  jam: {
    flex: 0.4,
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
    //backgroundColor: "white",
  },
  cupertinoButtonSave: {
    height: 36,
    borderRadius: 10,
    marginTop: '2%',
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  cupertinoButtonDelete: {
    top: '2%',
    right: '2%',
    position: "absolute"
  },
  cupertinoButtonEdit: {
    top: '2%',
    right: '2%',
    position: "absolute"
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  Layanan_reservasi_pesan: {
    flex: 1,
    paddingTop: '2%',
    flexDirection: 'column',
    marginHorizontal: 20,
  },

  Tab_pesan: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 6,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(218,218,218,1)',
  },
  Group316: item => ({
    paddingVertical: 7,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    borderRadius: 20,
    backgroundColor: item ? '#43A9DD' : 'rgba(217,217,217,1)',
  }),
  Txt6110: item => ({
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: item ? 'rgba(255, 255, 255, 1)' : 'rgba(79,92,99,1)',
    textAlign: 'center',
    justifyContent: 'center',
  }),

  Chat_label: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 11,
    paddingBottom: 15,
    paddingLeft: 7,
    paddingRight: 15,
    borderRadius: 10,
    backgroundColor: '#43A9DD',
  },
  Rectangle2: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 100,
  },
  Blockpesan: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  Txt011: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(250,250,250,1)',
    marginBottom: 4,
  },
  Txt137: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(250,250,250,1)',
    textAlign: 'justify',
    marginBottom: 4,
  },

  User: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subUser: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Useravatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 100,
  },
  IconHeader: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  Text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  Txt254: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 4,
  },
  Txt681: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    paddingRight: 25,
  },
  Txt2541: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    marginBottom: 4,
  },
  Txt6811: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,32,51,1)',
    paddingRight: 25,
  },
  Email_bantuan: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  wrapperJangan: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
  },
  Kirim_email: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
  multiple: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  multiple1: {
    paddingTop: 20,
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
  },

  Txt6105: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 100,
    marginBottom: 10,
    marginTop: -10,
    width: 30,
    height: 30,
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
  Btn_tambah: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: '25%',
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
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
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    alignSelf: "stretch",
    textAlign: 'center',
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: '2%',
    backgroundColor: "white",
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});
