import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

import colors from "../constants/colors";

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  // component will mount
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }

      const transformedData = JSON.parse(userData);
      const { token, userId, expirationDate } = transformedData;
      const newExpirationDate = new Date(expirationDate);

      if (newExpirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      props.navigation.navigate("Shop");
      dispatch(authActions.authenticate(userId, token));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartupScreen;
