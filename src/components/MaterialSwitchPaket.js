import React, { Component, useState } from "react";
import { StyleSheet, View, Switch, Text } from "react-native";
import MaterialStackedLabelTextboxPaket from "./MaterialStackedLabelTextboxPaket";

function MaterialSwitch(props) {
  const [active, setActive] = useState(props.active === '1' ? true : false);

  const onChange = async (e) => {
    await setActive(e);
    //await alert(active);
    //await props.toogleSwitch(e, 'paket', props.value);
  }

  const onChangeBiaya = async (e) => {
    await props.onChangeBiaya(active, e.nativeEvent.text, 'paket', props.value);
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.boxSwitch1}>
        <Switch
          value={active}
          trackColor={{ true: "rgba(0,0,0,1)", false: "rgba(155,155,155,1)" }}
          thumbColor="rgba(65,170,223,1)"
          style={styles.switch1}
          disabled={!props.updateData}
          //onValueChange={(e) => props.toogleSwitch(e, 'paket', props.value)}
          onValueChange={(e) => onChange(e)}
        ></Switch>
      </View>
      <View style={styles.boxSwitch2}>
        <Text style={styles.label}>{props.desc}</Text>
      </View>
      <MaterialStackedLabelTextboxPaket
        style={styles.biayalayanankhusus1}
        updateData={active}
        onChangeBiaya={onChangeBiaya}
        biaya_layanan={props.biaya_layanan}
      />
      <View style={styles.separator1}></View>
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
    paddingTop: 5,
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
  biayalayanankhusus1: {
    height: 60,
    width: 271
  },
});

export default MaterialSwitch;
