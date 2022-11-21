/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, NativeModules, TouchableOpacity, NativeEventEmitter} from 'react-native';
import iosConfigJson from './data/ios-light-config.json'; 
import androidConfigJson from './data/android-light-config.json'; 

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const NTESRNRouterEmitter = new  NativeEventEmitter(NativeModules.QuickLoginPlugin)

export default class App extends Component {
  render() {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={this._onPressButton}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>预取号</Text>
                </View>
            </TouchableOpacity>
			
			<TouchableOpacity onPress={this._onPressGetNumberButton}>
			    <View style={styles.button}>
			        <Text style={styles.buttonText}>取号</Text>
			    </View>
			</TouchableOpacity>
        </View>
    );
  }

    componentDidMount () {
		NativeModules.QuickLoginPlugin.initQuickLogin('易盾业务id')
        this.subScription = NTESRNRouterEmitter.addListener('uiCallback',(value)=>{
             console.log(value)
         });
    }

    componentWillUnmount(){
        this.subScription.remove();
    }

    _onPressButton() {
        NativeModules.QuickLoginPlugin.prefetchNumber((success, resultDic) => {
            if (success) {
				alert("预取号成功")
            } else {
                alert('预取号失败请降级处理')
            }
        });
      
    }
	
	_onPressGetNumberButton() {
		var uiJsonConfig;
		if(Platform.OS==='android'){
		   uiJsonConfig=androidConfigJson;
		}else{
		   uiJsonConfig=iosConfigJson;
		}
		console.log(uiJsonConfig)
		NativeModules.QuickLoginPlugin.setUiConfig(uiJsonConfig,(success)=>{});		
		NativeModules.QuickLoginPlugin.login((success, resultDic)=>{
		    console.log(resultDic)
		    if (success) {
		        NativeModules.QuickLoginPlugin.closeAuthController();
		    } else {
		
		    }
		});
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
    button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        padding: 20,
        color: 'white'
    }
});