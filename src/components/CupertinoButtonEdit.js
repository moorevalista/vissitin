import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function CupertinoButtonEdit(props) {
  const ubahJadwalKhusus = props.ubahJadwalKhusus;
  const setUbahJadwalKhusus = props.setUbahJadwalKhusus;

  const str = props.name;
  const data = str.split("|");

  const setUpdate = () => {
    props.onClickEdit(props.name);
  }

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={(!props.ubahJadwalKhusus || (props.id_detail !== data[0])) ? setUpdate : props.onCancelKhusus}
      >
      {!props.ubahJadwalKhusus ?
      <Icon name="ios-create" style={styles.icon}></Icon>
      :
      (props.id_detail === data[0]) ?
        <Icon name="close-circle" style={styles.icon} />:<Icon name="ios-create" style={styles.icon} />
      }
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

export default CupertinoButtonEdit;
