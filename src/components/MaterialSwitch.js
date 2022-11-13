import React, { Component } from "react";
import { StyleSheet, View, Switch, Text } from "react-native";

function MaterialSwitch(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.boxSwitch1}>
        <Switch
          value={props.value === '1' ? true : false}
          trackColor={{ true: "rgba(0,0,0,1)", false: "rgba(155,155,155,1)" }}
          thumbColor="rgba(65,170,223,1)"
          style={styles.switch1}
          disabled={!props.updateData}
          onValueChange={(e) => props.type === "kategori" ? props.handleChangeKategori(e, props.name) : props.handleChangeKlasifikasi(e, props.name)}
        ></Switch>
      </View>
      <View style={styles.boxSwitch2}>
        <Text style={styles.label}>{props.label}</Text>
        {props.desc ?
          <Text style={styles.desc}>{"(" + props.desc + ")"}</Text>:<></>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  switch1: {
    width: 60,
    height: 30,
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212",
    padding: 0,
  },
  desc: {
    fontFamily: "roboto-regular",
    color: "#464655",
    padding: 0,
    fontStyle: 'italic',
    fontSize: 12
  },
  boxSwitch1: {
    alignSelf: "flex-start",
    width: '20%',
    height: 30,
    padding: 0,
    marginRight: '1%',
  },
  boxSwitch2: {
    alignSelf: "flex-start",
    width: '70%',
    height: 'auto',
    padding: 0,
    marginRight: '1%',
  },
});

export default MaterialSwitch;
