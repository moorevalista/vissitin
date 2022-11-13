import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function HeaderInformasi({props}) {

  const backToHome = () => {
    props.route.params.onRefresh !== undefined ? props.route.params.onRefresh():'';
    props.navigation.goBack();
  }
  return (
    <>
      <View style={styles.rect2}></View>
      <View style={[styles.container, props.style]}>
        <View style={styles.leftWrapper}>
          <TouchableOpacity style={styles.leftIconButton} onPress={backToHome}>
            <Icon name="ios-arrow-back" style={styles.leftIcon}></Icon>
            <Text style={styles.leftText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textWrapper}>
          <Text numberOfLines={1} style={styles.informasi}>
            Informasi
          </Text>
        </View>
        <View style={styles.rightWrapper}></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#EFEFF4",
    paddingRight: 8,
    paddingLeft: 8
  },
  rect2: {
    height: 31,
    backgroundColor: "#efeff4"
  },
  leftWrapper: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    height: 44,
    alignSelf: "flex-end"
  },
  leftIconButton: {
    flexDirection: "row"
  },
  leftIcon: {
    color: "rgba(65,170,223,1)",
    fontSize: 32
  },
  leftText: {
    alignSelf: "center",
    fontSize: 17,
    paddingLeft: 5,
    color: "rgba(65,170,223,1)",
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    alignSelf: "flex-end"
  },
  informasi: {
    fontSize: 17,
    lineHeight: 17,
    color: "#000"
  },
  rightWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    height: 44,
    alignSelf: "flex-end"
  }
});

export default HeaderInformasi;
