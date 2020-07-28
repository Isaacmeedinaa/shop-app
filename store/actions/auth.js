import { AsyncStorage } from "react-native";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDJ2sq46_0Z-9a8O8hhVyuCvHziS-qFLj8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorMsg = errorResData.error.message;
      let message;

      if (errorMsg === "EMAIL_EXISTS") {
        message = "This email already exists";
      }

      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDJ2sq46_0Z-9a8O8hhVyuCvHziS-qFLj8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorMsg = errorResData.error.message;
      let message;

      if (errorMsg === "EMAIL_NOT_FOUND") {
        message = "This email could not be found";
      } else if (errorMsg === "INVALID_PASSWORD") {
        message = "This password is not correct";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  clearTimeout(timer);
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expirationDate: expirationDate.toISOString(),
    })
  );
};
