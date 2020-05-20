import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Text, View, Button } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";
import TakePictureScreen from "./src/TakePicture";
class SelectPictureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      image: null,
    };
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === "granted" });
  }
  _getPhotoLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  render() {
    const { image, hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {image ? (
              <AutoHeightImage width={180} source={{ uri: image }} />
            ) : (
              //<Image source={{ uri: image }} style={{ flex: 1 }} />
              <View />
            )}
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Button
              onPress={this._getPhotoLibrary.bind(this)}
              title="Pick image!"
            />
            <Text>{"\n"}</Text>
            <Button
              title="Take Picture"
              onPress={() => this.props.navigation.navigate("TakePicture")}
            />
          </View>
        </View>
      );
    }
  }
}

const AppNavigator = createStackNavigator(
  {
    PickImage: SelectPictureScreen,
    TakePicture: TakePictureScreen,
  },
  {
    initialRouteName: "PickImage",
  }
);

const AppContainer = createAppContainer(AppNavigator);
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
