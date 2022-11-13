import React, { Component, useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { form_validation } from "../form_validation";

function CupertinoButtonDelete(props) {
  const formValidation = useContext(form_validation);
  const [updateData, setUpdateData] = useState(false);
  //const ubahJadwal = props.ubahJadwal;
  //const setUbahJadwal = props.setUbahJadwal;

  const setUpdate = async () => {
    allowUpdate = await props.checkPayment(props.name);

    if(allowUpdate) {
      await setUpdateData(!updateData);
    }else {
      formValidation.showError('Klien belum melakukan pembayaran, sehingga jadwal belum bisa diubah !!!');
    }
    //await props.setUbahJadwal(!updateData);
  }

  useEffect(() => {
    if(updateData) {
      props.setUbahJadwal(updateData);
      props.setCurrentId(props.name);
      props.id_paket === '1' ? handleExpandReg():handleExpand();
    }
  },[updateData]);

  const handleExpand = async () => {
    props.handleExpand(props.name);
  }

  const handleExpandReg = async () => {
    props.handleExpandReg(props.name);
  }
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={!props.ubahJadwal ? setUpdate : props.onCancel}
      >
      {(!props.ubahJadwal && props.name !== props.currentId) ?
      <Icon name="ios-create" style={styles.icon}></Icon>
      :
      <Icon name="close-circle" style={styles.icon}></Icon>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5
  },
  icon: {
    color: "#000",
    fontSize: 24
  }
});

export default CupertinoButtonDelete;
