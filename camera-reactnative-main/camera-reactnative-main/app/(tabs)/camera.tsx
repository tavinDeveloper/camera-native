import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

export default function App(){
    const [flipCam, setFlipcam] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [foto, setFoto] = useState<string | null>(null);

    if(!permission){
        return <View/>;
    }

    if(!permission.granted){
        return(
            <View style={styles.container}>
                <Text style={styles.message}>Libera ai! Precisamos da permissão pra usar a câmera</Text>
                <Button onPress={requestPermission} title="Conceder permissão"/>
            </View>
        );
    }
    function trocarCamera(){
        setFlipcam(current => (current === 'back' ? 'front' : 'back'));
    }
    async function sharePhoto() {
        if(!foto){
            alert('Tire uma foto antes de compartilhar.');
            return;
        }

        if(!(await Sharing.isAvailableAsync())) {
            alert('Putz, não é possivel compartilhar na sua platafomra');
            return;
        }

        await Sharing.shareAsync(foto);
    }

    return(
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef} facing={flipCam}>
                <View style={styles.rodape}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={trocarCamera}>
                            <Entypo name="cw" size={24} color="white"/>
                            <Text style={styles.text}>Virar Camera</Text>
                        </TouchableOpacity>
                    </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                            style={styles.button}
                            onPress={async() => {
                                if(cameraRef.current) {
                                    let photo = await cameraRef.current.takePictureAsync();
                                    console.log('foto:', photo);
                                    setFoto(photo.uri);
                                }
                            }}>
                                <Entypo name="camera" size={24} color="white"/>
                                <Text style={styles.text}>Tirar foto</Text>
                            </TouchableOpacity>
                            {foto && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={sharePhoto}>
                                        <Entypo name="share" size={24} color="white"/>
                                        <Text style={styles.text}>Compartilhar foto</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                </View>
            </CameraView>
            {foto && <Image source={{uri: foto}} style={{width: 200, height: 200}}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        textAlign: 'left',
        gap: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    rodape: {
        position: 'absolute',
        top: '80%',
        left: '30%',
        marginBottom: 35,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});