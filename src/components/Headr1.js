import React, { Component, useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Fotoprofile from "./Fotoprofile";
import Icon from "react-native-vector-icons/Feather";
import Clipboard from '@react-native-clipboard/clipboard';

function Headr1(props) {
  const [dataNakes, setDataNakes] = useState(props.dataLogin);
  const updateData = props.updateData;
  const setUpdateData = props.setUpdateData;
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

  return (
    <View style={styles.container}>
      <View style={styles.rect}>
        <View style={styles.group}>
          <View style={styles.fotoprofileRow}>
            <TouchableOpacity disabled={(props.uploadProfile !== undefined && props.uploadProfile) ? !updateData : true} onPress={() => handleChoosePhoto(props.name)}>
              <Fotoprofile style={styles.fotoprofile} thumbProfile={props.thumbProfile} />
            </TouchableOpacity>
            <View style={styles.namauserColumn}>
              <Text style={styles.namauser}>{dataNakes.nama_nakes}</Text>
              <Text style={styles.fisioterapi}>{dataNakes.profesi}</Text>
              <View style={styles.kodeReferensiRow}>
                <Text style={styles.kodeReferensi}>{id_nakes}</Text>
                <TouchableOpacity onPress={()=> copyToClipboard()}>
                  <Icon name="copy" style={styles.icon}></Icon>
                </TouchableOpacity>
              </View>
              <View style={styles.status}><Text style={styles.statusText}>{dataNakes.status}</Text></View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  rect: {
    backgroundColor: "#41aadf",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    paddingTop: '10%'
  },
  group: {
    flexDirection: 'row',
    padding: '2%'
  },
  fotoprofile: {
    height: 87,
    width: 87,
  },
  namauser: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    textAlign: "left"
  },
  fisioterapi: {
    fontFamily: "roboto-italic",
    color: "rgba(255,255,255,1)",
    fontSize: 14,
    textAlign: "left",
    marginTop: 4,
  },
  status: {
    backgroundColor: "#2E313F",
    borderRadius: 5,
    marginTop: 4
  },
  statusText: {
    color: '#EFF1F5',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: "center",
  },
  kodeReferensi: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 14,
    textAlign: "left"
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    marginLeft: 6
  },
  kodeReferensiRow: {
    flexDirection: "row",
    marginTop: 3,
    marginRight: 0,
  },
  namauserColumn: {
    width: '60%',
    marginLeft: '3%',
    marginTop: '1%',
    marginBottom: '1%',
  },
  fotoprofileRow: {
    height: '100%',
    flexDirection: "row",
    marginRight: 0,
  }
});

export default Headr1;
