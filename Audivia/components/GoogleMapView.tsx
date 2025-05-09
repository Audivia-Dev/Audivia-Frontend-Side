import React from "react";
import { Dimensions, View } from "react-native";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
export default function GoogleMapView() {
    return (
        <View style={{marginTop: 20, alignItems: 'center', marginBottom: 30}}>
            <MapView style={{ width: Dimensions.get('screen').width*0.89, 
                height: Dimensions.get('screen').height*0.23,
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                >
                
            </MapView>
        </View>
    )
}