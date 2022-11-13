import React, { Component, useState, useEffect, useContext } from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import { form_validation } from "../../../form_validation";

const Header = ({name, props, dataLogin, thumbProfile}) => {
  const formValidation = useContext(form_validation);
  const [dataNakes, setDataNakes] = useState(dataLogin);
  const updateData = updateData;
  const setUpdateData = setUpdateData;
  //alert(props.updateData);
  //alert(JSON.stringify(dataNakes));
  const id_nakes = dataNakes.id_nakes.substring(3);

  const [copiedText, setCopiedText] = useState('')

  const copyToClipboard = () => {
    Clipboard.setString(id_nakes);
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString()
    setCopiedText(text)
  }

  const handleChoosePhoto = (name) => {
    props.handleChoosePhoto(name);
  }

  useEffect(() => {
    if(props.dataLogin) {
      setDataNakes(props.dataLogin);
    }

    return () => {
      
    }
  },[props.dataLogin]);

  const Icons = ({label, name}) => {
    return <Icon style={styles.Iconarrow} name={name} />;
  };
  const Icons2 = ({label, name}) => {
    return <Icon style={styles.IconSettings} name={name} />;
  };

  const IconImage = ({label, name}) => {
    return <Icon style={{color: 'rgba(106,120,132,1)', fontSize: 48,}} name={name} />;
  };
  
  const openProfile = async() => {
    props.navigation.navigate('EditDataPribadi', { base_url: base_url, updateData: updateData } );
  }

  return (
    <View style={styles.User}>
      <View style={styles.subUser}>
        <Image
          style={styles.Useravatar}
          source={thumbProfile ? {uri: thumbProfile} : require("../../../assets/images/profile-01.png")}
          resizeMode="cover"
        />
        <View style={styles.Text}>
          <View style={styles.subCols}>
            <Text style={[styles.Txt241, {fontWeight: 'bold'}]}>{dataNakes.nama_nakes}</Text>
          </View>
        {/*<Text style={styles.Txt241}>{dataNakes.profesi}</Text>*/}
          <View style={styles.subCols}>
            <Text style={styles.Txt576}>{id_nakes}</Text>
            <TouchableOpacity onPress={() => copyToClipboard()}>
              <Icons label="Panah" name="copy" />
            </TouchableOpacity>
          </View>
          <View style={[styles.subCols, {paddingHorizontal: '2%', borderRadius: 5, backgroundColor: '#43A9DD'}]}>
            <Text style={[styles.Txt576, {fontSize: 12, color: 'white', textAlign: 'center', fontWeight: 'bold'}]}>{dataNakes.status.toUpperCase()}</Text>
          </View>
        </View>
        {name === 'beranda' ?
          <TouchableOpacity
            style={styles.wrapperKembali}
            onPress={() => props.navigation.navigate('settingScreen', { base_url: formValidation.base_url, dataLogin: dataLogin })}>
            <Icons2
              label="Panah"
              name="settings"
              color="rgba(255, 255, 255, 1)"
            />
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={styles.wrapperKembali}
            onPress={() => props.navigation.goBack()}>
            <Icons2
              label="Panah"
              name="chevron-back"
              color="rgba(255, 255, 255, 1)"
            />
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  User: {
    paddingVertical: '2%',
    paddingHorizontal: '2%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    // backgroundColor: 'rgba(40, 60, 80, 0.2)'
  },
  subUser: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  subCols: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '2%'
  },
  Useravatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 100
  },
  wrapperKembali: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  Text: {
    flex: 1,
    display: 'flex',
  },
  Txt241: {
    flex: 1,
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,32,51,0.6)',
    // marginBottom: 4,
  },
  Txt576: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,32,51,0.6)',
  },
  Iconarrow: {
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 14,
    opacity: 0.8,
  },
  IconSettings: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
});
