import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CommonActions } from '@react-navigation/native';

function Transaksiheader({props}) {

  const backToHome = () => {
    props.route.params.onRefresh !== undefined ? props.route.params.onRefresh():'';
    props.navigation.goBack();
  }
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity style={styles.leftIconButton} onPress={backToHome}>
          <IoniconsIcon
            name="ios-arrow-back"
            style={styles.leftIcon}
          />
          <Text style={styles.kembali}>Kembali</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.transaksi}>
          Transaksi
        </Text>
      </View>
      <View style={styles.rightWrapper}>
        <TouchableOpacity style={styles.rightIconButton}>
          {/*<MaterialCommunityIconsIcon
            name="home"
            style={styles.icon}
          ></MaterialCommunityIconsIcon>*/}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#EFEFF4",
    paddingRight: 8,
    paddingLeft: 8
  },
  leftWrapper: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  button: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  leftIconButton: {
    flexDirection: "row",
  },
  leftIcon: {
    color: "rgba(65,170,223,1)",
    fontSize: 32
  },
  kembali: {
    fontSize: 17,
    color: "rgba(65,170,223,1)",
    paddingLeft: 5,
    alignSelf: "center"
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  transaksi: {
    fontSize: 17,
    lineHeight: 17,
    color: "#000"
  },
  rightWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  rightIconButton: {},
  icon: {
    top: 6,
    position: "absolute",
    color: "#41aadf",
    fontSize: 30,
    right: 3
  }
});

export default Transaksiheader;
