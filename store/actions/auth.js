export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

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

    dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
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
    console.log(resData);

    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
  };
};
