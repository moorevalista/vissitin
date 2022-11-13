import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function Btnsimpan(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onSubmit} >
      <Text style={styles.simpan}>SIMPAN</Text>
      {/*<Icon name="save" style={styles.icon}></Icon>*/}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(65,170,223,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  simpan: {
    color: "#fff",
    fontSize: 17
  },
  icon: {
    color: "#000",
    fontSize: 24
  }
});

export default Btnsimpan;
