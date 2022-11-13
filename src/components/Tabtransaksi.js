import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

function Tabtransaksi(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.textWrapper}>
        <TouchableOpacity style={props.activeTab === 'booking' ? styles.segmentTextWrapperLeft1 : styles.segmentTextWrapperLeft2} onPress={() => props.onChangeTab("booking")}>
          <Text style={props.activeTab === 'booking' ? styles.label : styles.label2}>Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={props.activeTab === 'antrian' ? styles.segmentTextWrapperCenter1 : styles.segmentTextWrapperCenter2} onPress={() => props.onChangeTab("antrian")}>
          <Text style={props.activeTab === 'antrian' ? styles.label : styles.label2}>Antrian</Text>
        </TouchableOpacity>
        <TouchableOpacity style={props.activeTab === 'selesai' ? styles.segmentTextWrapperCenter1 : styles.segmentTextWrapperCenter2} onPress={() => props.onChangeTab("selesai")}>
          <Text style={props.activeTab === 'selesai' ? styles.label : styles.label2}>Selesai</Text>
        </TouchableOpacity>
        <TouchableOpacity style={props.activeTab === 'batal' ? styles.segmentTextWrapperRight1 : styles.segmentTextWrapperRight2} onPress={() => props.onChangeTab("batal")}>
          <Text style={props.activeTab === 'batal' ? styles.label : styles.label2}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: "#FFF"
  },
  textWrapper: {
    height: 'auto',
    flex: 1,
    flexDirection: "row"
  },
  label: {
    fontSize: 13,
    color: "#FFFFFF"
  },
  label2: {
    fontSize: 13,
    color: "rgba(65,170,223,1)"
  },
  segmentTextWrapperLeft1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: 'rgba(54,54,54,1)',
    padding: '2%',
    borderWidth: 1,
    borderColor: "rgba(54,54,54,1)",
    // borderBottomLeftRadius: 5,
    // borderTopLeftRadius: 5
  },
  segmentTextWrapperLeft2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: '2%',
    borderWidth: 1,
    borderColor: "rgba(54,54,54,1)",
    // borderBottomLeftRadius: 5,
    // borderTopLeftRadius: 5
  },
  segmentTextWrapperCenter1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(54,54,54,1)",
    padding: '2%',
    borderWidth: 1,
    borderColor: "rgba(54,54,54,1)",
  },
  segmentTextWrapperCenter2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: '2%',
    borderWidth: 1,
    borderColor: "rgba(54,54,54,1)",
  },
  segmentTextWrapperRight1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(54,54,54,1)",
    padding: '2%',
    borderWidth: 1,
    borderColor: "rgba(54,54,54,1)",
    // borderBottomRightRadius: 5,
    // borderTopRightRadius: 5
  },
  segmentTextWrapperRight2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: '2%',
    borderWidth: 1,
    borderColor: "rgba(54,54,54,1)",
    // borderBottomRightRadius: 5,
    // borderTopRightRadius: 5
  },
});

export default Tabtransaksi;
