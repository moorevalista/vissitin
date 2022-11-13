import React, { Component, useState, useEffect, useContext } from "react";
import { StyleSheet, View, Switch, Text } from "react-native";
import { form_validation } from "../form_validation";
import RNPickerSelect from 'react-native-picker-select';
import Spinner from 'react-native-loading-spinner-overlay';
import IconPanah from 'react-native-vector-icons/Ionicons';

function CompJadwal(props) {
  const formValidation = useContext(form_validation);
  const [jamAwal, setJamAwal] = useState('');
  const [jamAkhir, setJamAkhir] = useState('');
  const [jamAwalSore, setJamAwalSore] = useState('');
  const [jamAkhirSore, setJamAkhirSore] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectTime, setSelectTime] = useState(false);
  const [selectedJamAwalPagi, setSelectedJamAwalPagi] = useState(props.jamPilihan[props.name].pagi.awal);
  const [selectedJamAkhirPagi, setSelectedJamAkhirPagi] = useState(props.jamPilihan[props.name].pagi.akhir);
  const [selectedJamAwalSore, setSelectedJamAwalSore] = useState(props.jamPilihan[props.name].sore.awal);
  const [selectedJamAkhirSore, setSelectedJamAkhirSore] = useState(props.jamPilihan[props.name].sore.akhir);
  const updateData = props.updateData;
  
  const [activePagi, setActivePagi] = useState(props.jamPilihan[props.name].pagi.active);
  const [activeSore, setActiveSore] = useState(props.jamPilihan[props.name].sore.active);

  const onChange = async (e, shift) => {
    shift === 'pagi' ? await setActivePagi(e) : await setActiveSore(e);
    //await props.handleChangeJadwal(e, props.name, shift);

    await handleChangeJadwal(e, props.name, shift);
    //await alert(active);
    //await props.toogleSwitch(e, 'paket', props.value);
  }

  useEffect(() => {
    //alert(JSON.stringify(props.jamPilihan));
    if(props.jamPilihan) {
      listJamAwal();
      listJamAkhir();
      listJamAwalSore();
      listJamAkhirSore();

      setActivePagi(props.jamPilihan[props.name].pagi.active);
      setActiveSore(props.jamPilihan[props.name].sore.active);

      setSelectedJamAwalPagi(props.jamPilihan[props.name].pagi.awal);
      setSelectedJamAwalSore(props.jamPilihan[props.name].sore.awal);

      setSelectedJamAkhirPagi(props.jamPilihan[props.name].pagi.akhir);
      setSelectedJamAkhirSore(props.jamPilihan[props.name].sore.akhir);
    }

    return () => {
      setLoading(false);
    }
  },[props.jamPilihan]);

  async function handleChangeJadwal(e, name, shift) {
    await setSelectTime(true);
    await props.handleChangeJadwal(e, name, shift);
    await setSelectTime(false);
  }

  async function handleChangeJamAwalPagi(e) {
    await setSelectTime(true);
    props.handleChangeJamAwal('pagi', props.name, e);
    //await setSelectedJamAwalPagi(e);
    await setSelectTime(false);
  }

  async function handleChangeJamAkhirPagi(e) {
    await setSelectTime(true);
    props.handleChangeJamAkhir('pagi', props.name, e);
    //await setSelectedJamAkhirPagi(e);
    await setSelectTime(false);
  }

  async function handleChangeJamAwalSore(e) {
    await setSelectTime(true);
    props.handleChangeJamAwal('sore', props.name, e);
    //await setSelectedJamAwalSore(e);
    await setSelectTime(false);
  }

  async function handleChangeJamAkhirSore(e) {
    await setSelectTime(true);
    props.handleChangeJamAkhir('sore', props.name, e);
    //await setSelectedJamAkhirSore(e);
    await setSelectTime(false);
  }

  const listJamAwal = async () => {
    const newItems = formValidation.getDataSheet('jam');
    
    let options = [];
    if(newItems) {
      //options.push({value: '', label: ''});
      newItems.items.map((item) => {
        if(item.jam < 12) {
          return (
            options.push({value: item.jam, label: item.jam})
          )
        }
      });
    }

    setJamAwal(options);
    setLoading(false);
  }

  const listJamAkhir = async () => {
    const newItems = formValidation.getDataSheet('jam');
    
    let options = [];
    if(newItems) {
      //options.push({value: '', label: ''});
      newItems.items.map((item) => {
        if(item.jam > props.jamPilihan[props.name].pagi.awal && item.jam <= 12) {
          return (
            options.push({value: item.jam, label: item.jam})
          )
        }
      });
    }

    setJamAkhir(options);
    setLoading(false);
  }

  const listJamAwalSore = async () => {
    const newItems = formValidation.getDataSheet('jam');
    
    let options = [];
    if(newItems) {
      //options.push({value: '', label: ''});
      newItems.items.map((item) => {
        if(item.jam >= 13 && item.jam < 21) {
          return (
            options.push({value: item.jam, label: item.jam})
          )
        }
      });
    }

    setJamAwalSore(options);
    setLoading(false);
  }

  const listJamAkhirSore = async () => {
    const newItems = formValidation.getDataSheet('jam');
    
    let options = [];
    if(newItems) {
      //options.push({value: '', label: ''});
      newItems.items.map((item) => {
        if(item.jam > props.jamPilihan[props.name].sore.awal && item.jam > 13) {
          return (
            options.push({value: item.jam, label: item.jam})
          )
        }
      });
    }

    setJamAkhirSore(options);
    setLoading(false);
  }

  const JamAwal = () => {
    const items = jamAwal;
    const placeholder = {
      label: 'Pilih Jam...',
      value: ''
    };

    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== selectedJamAwalPagi) {
            handleChangeJamAwalPagi(value)
          }
        }}
        style={pickerSelectStyles}
        value={selectedJamAwalPagi}
        useNativeAndroidPickerStyle={false}
      />
    )
  }

  const JamAkhir = () => {
    const items = jamAkhir;
    const placeholder = {
      label: 'Pilih Jam...',
      value: ''
    };

    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== selectedJamAkhirPagi) {
            handleChangeJamAkhirPagi(value)
          }
        }}
        style={pickerSelectStyles}
        value={selectedJamAkhirPagi}
        useNativeAndroidPickerStyle={false}
      />
    )
  }

  const JamAwalSore = () => {
    const items = jamAwalSore;
    const placeholder = {
      label: 'Pilih Jam...',
      value: ''
    };

    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== selectedJamAwalSore) {
            handleChangeJamAwalSore(value)
          }
        }}
        style={pickerSelectStyles}
        value={selectedJamAwalSore}
        useNativeAndroidPickerStyle={false}
      />
    )
  }

  const JamAkhirSore = () => {
    const items = jamAkhirSore;
    const placeholder = {
      label: 'Pilih Jam...',
      value: ''
    };

    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== selectedJamAkhirSore) {
            handleChangeJamAkhirSore(value)
          }
        }}
        style={pickerSelectStyles}
        value={selectedJamAkhirSore}
        useNativeAndroidPickerStyle={false}
      />
    )
  }

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
            alignSelf: 'center',
          }}
          name={name}
        />
      );
    }
  };

  return (
  !loading ?
    <View style={[styles.container, props.style]}>
      <View style={styles.boxSwitch}>
        <Text style={styles.label}>{props.label}</Text>
      </View>

      <View style={styles.boxSwitch}>
        <Switch
            value={activePagi}
            trackColor={{ true: "rgba(0,0,0,1)", false: "rgba(155,155,155,1)" }}
            thumbColor="rgba(65,170,223,1)"
            style={styles.switch1}
            disabled={!props.updateData}
            //onValueChange={(e) => props.handleChangeJadwal(e, props.name)}
            onValueChange={(e) => onChange(e, 'pagi')}
          ></Switch>
        <Text style={styles.label}>Pagi</Text>
      </View>
      <View style={styles.boxContainer} pointerEvents={!updateData || !activePagi ? 'none':'auto'}>
        <View style={styles.boxSwitch1}>
          {!selectTime ?
            <View style={styles.Box1}>
              <View style={styles.Checkbox_pribadi}>
                <JamAwal />
              </View>
              <Icons label="Panah" name="time" />
            </View>
            :
            <Spinner
                  size="small"
                  animation="fade"
                  visible={selectTime}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
          }
        </View>
        <View style={styles.boxSwitch3}>
          <Text style={styles.label2}>s/d</Text>
        </View>
        <View style={styles.boxSwitch2}>
          {!selectTime ?
            <View style={styles.Box1}>
              <View style={styles.Checkbox_pribadi}>
                <JamAkhir />
              </View>
              <Icons label="Panah" name="time" />
            </View>
            :
            <Spinner
                  size="small"
                  animation="fade"
                  visible={selectTime}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
          }
        </View>
      </View>

      <View style={styles.boxSwitch}>
        <Switch
            value={activeSore}
            trackColor={{ true: "rgba(0,0,0,1)", false: "rgba(155,155,155,1)" }}
            thumbColor="rgba(65,170,223,1)"
            style={styles.switch1}
            disabled={!props.updateData}
            //onValueChange={(e) => props.handleChangeJadwal(e, props.name)}
            onValueChange={(e) => onChange(e, 'sore')}
          ></Switch>
        <Text style={styles.label}>Sore</Text>
      </View>
      <View style={styles.boxContainer} pointerEvents={!updateData || !activeSore ? 'none':'auto'}>
        <View style={styles.boxSwitch1}>
          {!selectTime ?
            <View style={styles.Box1}>
              <View style={styles.Checkbox_pribadi}>
                <JamAwalSore />
              </View>
              <Icons label="Panah" name="time" />
            </View>
            :
            <Spinner
                  size="small"
                  animation="fade"
                  visible={selectTime}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
          }
        </View>
        <View style={styles.boxSwitch3}>
          <Text style={styles.label2}>s/d</Text>
        </View>
        <View style={styles.boxSwitch2}>
          {!selectTime ?
            <View style={styles.Box1}>
              <View style={styles.Checkbox_pribadi}>
                <JamAkhirSore />
              </View>
              <Icons label="Panah" name="time" />
            </View>
            :
            <Spinner
                  size="small"
                  animation="fade"
                  visible={selectTime}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#D13395"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
          }
        </View>
      </View>
    </View>
  :<></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,66,105,0.28)',
    borderRadius: 10,
    height: 'auto',
    padding: 5,
    marginBottom: 5
  },
  Box1: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    //marginHorizontal: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,66,105,0.28)',
  },
  Checkbox_pribadi: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  boxSwitch: {
    alignSelf: "stretch",
    flexDirection: "row",
    height: 'auto',
    padding: 0,
  },
  switch1: {
    alignSelf: "flex-start",
    width: 60,
    height: 30,
  },
  label: {
    alignSelf: "flex-start",
    padding: 5,
    fontFamily: "roboto-regular",
    color: "#121212",
  },
  label2: {
    alignSelf: "flex-start",
    padding: 5,
    fontFamily: "roboto-regular",
    color: "#121212",
    //marginTop: '50%',
  },
  label3: {
    textAlign: 'center',
    padding: 5,
    fontFamily: "roboto-regular",
    color: "#121212",
    width: '42%'
  },
  boxContainer: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    height: 'auto',
    padding: 5
  },
  boxSwitch1: {
    alignSelf: "flex-start",
    width: '42%',
    height: 'auto',
    padding: 0,
    marginRight: '1%',
  },
  boxSwitch2: {
    alignSelf: "flex-start",
    width: '42%',
    height: 'auto',
    padding: 0,
  },
  boxSwitch3: {
    alignSelf: "flex-start",
    width: '12%',
    //height: 100,
    padding: 0,
    marginRight: '1%',
  },
  separator: {
    alignSelf: "flex-start",
    width: '12%',
    height: 'auto',
    padding: 0,
    marginRight: '1%',
  },
  jam: {
    //height: 100,
    width: '100%',
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    backgroundColor: "white"
  },
  jamError: {
    //height: 100,
    width: '100%',
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    backgroundColor: "white"
  },
  jamItems: {
    //height: 100,
    width: 'auto',
    borderRadius: 10,
    fontSize: 12,
  }
  
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "white",
    fontSize: 14,
    //paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    flex: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "white",
    fontSize: 14,
    //paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default CompJadwal;
