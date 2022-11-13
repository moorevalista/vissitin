import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default function LoginOtp(props) {
  return (
    <View style={styles.OtpLogin}>
      <View style={styles.Group089}>
        <View style={styles.Form_pass_lama}>
          <TextInput
            placeholder="Masukkan Kode OTP"
            keyboardType="numeric"
            style={styles.Txt851}
          />
        </View>
      </View>
      <View style={styles.wrepperLink}>
        <Text style={styles.multiple1}>
          <Text style={{color: '#43A9DD'}}>Kode OTP </Text> akan dikirimkan pada
          No. Whatsapp pastikan No handphone anda aktif pada
          <Text style={{color: '#43A9DD'}}> Whatsapp </Text>
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('AlertPendaftaran')}>
          <View style={styles.Btn_lanjut}>
            <Text style={styles.Txt4105}>LANJUT</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  OtpLogin: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(54,54,54,1)',
  },
  Group089: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 50,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  Form_pass_lama: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Txt851: {
    flex: 1,
    fontSize: 12,
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    borderRadius: 20,
    color: 'rgba(0,32,51,1)',
    textAlign: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(184,202,213,1)',
    marginHorizontal: 50,
  },

  multiple1: {
    textAlign: 'center',
    color: 'white',
    paddingBottom: 25,
    marginHorizontal: 20,
  },
  wrepperLink: {flex: 1, justifyContent: 'flex-start', alignItems: 'center'},
  Btn_lanjut: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 100,
    borderRadius: 20,
    backgroundColor: '#43A9DD',
    height: 40,
  },
  Txt4105: {
    fontSize: 12,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
});
