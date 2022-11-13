import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Label2(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.icon2Row}>
        <Icon name="calendar-multiselect" style={styles.icon2}></Icon>
        <Text style={styles.jadwalAktif}>Jadwal Aktif</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  icon2: {
    color: "#41aadf",
    fontSize: 30
  },
  jadwalAktif: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    //marginTop: 8
    alignSelf: 'center'
  },
  icon2Row: {
    flexDirection: "row",
    flex: 1,
    padding: '2%'
  }
});

export default Label2;
