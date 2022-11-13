import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function Isilaporan(props) {
  return (
    <TouchableOpacity style={props.action === "report" ? [styles.container, props.style] : [styles.container, props.style, {backgroundColor: "#32B6D4"}]} onPress={props.action === "report" ? props.openLaporan : props.onCheckout}>
      <Text style={styles.laporanVisit}>{props.action === "report" ? 'LAPORAN VISIT' : 'CHECK OUT'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8E8E93",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  laporanVisit: {
    color: "#fff",
    fontSize: 17
  }
});

export default Isilaporan;
