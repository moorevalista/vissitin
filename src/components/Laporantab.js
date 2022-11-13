import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

function Laporantab(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.textWrapper}>
        {/*<TouchableOpacity style={props.activeTab === 'menunggu' ? styles.segmentTextWrapperLeft1 : styles.segmentTextWrapperLeft2} onPress={() => props.onChangeTab("menunggu")}>
          <Text style={props.activeTab === 'menunggu' ? styles.label : styles.label2}>Menunggu</Text>
        </TouchableOpacity>*/}
        <TouchableOpacity style={props.activeTab === 'selesai' ? styles.segmentTextWrapperRight1 : styles.segmentTextWrapperRight2} onPress={() => props.onChangeTab("selesai")}>
          <Text style={props.activeTab === 'selesai' ? styles.label : styles.label2}>Laporan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "rgba(65,170,223,1)",
    padding: '1%',
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5
  },
  segmentTextWrapperLeft2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: '1%',
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5
  },
  segmentTextWrapperRight1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(65,170,223,1)",
    padding: '1%',
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5
  },
  segmentTextWrapperRight2: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: '1%',
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5
  },
});

export default Laporantab;
