import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

function Segmentloker(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.textWrapper}>
        <TouchableOpacity style={styles.segmentTextWrapper} >
          <Text style={styles.label}>Informasi Lowongan Kerja</Text>
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
    //paddingLeft: 30,
    //paddingRight: 30,
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
  segmentTextWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(65,170,223,1)",
    padding: '1%',
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5
  },
  
});

export default Segmentloker;
