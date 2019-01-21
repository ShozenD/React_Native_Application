import React, { Component } from 'react';
import { Alert, StyleSheet, ActivityIndicator, Dimensions, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CaptureButton from './CaptureButton';

class Camera extends Component{
    constructor(props){
        super(props);

        this.state = {
            identifiedAs: '',
            loading: false
        }
    }

    takePicture = async function(){

        if (this.camera) {

            // Pause the camera's preview
            this.camera.pausePreview();

            // Set the activity indicator
            this.setState((previousState, props) => ({
                loading: true
            }));

            // Set options
            const options = {
                base64: true
            };

            // Get the base64 version of the image
            const data = await this.camera.takePictureAsync(options)

            // Get the identified image
            this.identifyImage(data.base64);
        }
    }

    identifyImage(imageData){

        // Initialise Clarifai api
        const Clarifai = require('clarifai');

        const app = new Clarifai.App({
            apiKey: '2d21a189352f4bac98bed24cf38e6236'
        });

        // Identify the image
        app.models.predict(Clarifai.GENERAL_MODEL, {base64: imageData})
        .then((response) => this.displayAnswer(response.outputs[0].data.concepts[0].name)
        .catch((err) => alert(err))
        );
    }

    displayAnswer(identifiedImage){

        // Dismiss the acitivty indicator
        this.setState((prevState, props) => ({
            identifedAs:identifiedImage,
            loading:false
        }));

    // Show an alert with the answer on
    Alert.alert(
            this.state.identifedAs,
            '',
            { cancelable: false }
        )

        // Resume the preview
        this.camera.resumePreview();
    }

    render(){
        return(
            <View>
                <RNCamera 
                ref={ref => {
                    this.camera = ref;
                    }} 
                style={StyleSheet.preview}
                type={RNCamera.Constants.Type.back}
                >
                    <ActivityIndicator size="large" style={styles.loadingIndicator} color="#fff" animating={this.state.loading}/>
                    <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                        <CaptureButton style={styles.capture} buttonDisabled={this.state.loading} onClick={this.takePicture.bind(this)}/>
                    </View>
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    loadingIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    }
});

export default Camera;