import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Camera from './src/components/Camera';
import { Header } from './src/components/common';

export default class App extends Component {

    constructor(props){
        super(props);
        process.nextTick = setImmediate;
    }

    render() {
        return (
            <View style={styles.container}>
                <Camera />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',   
    }
});
