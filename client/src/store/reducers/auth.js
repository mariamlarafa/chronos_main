import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";

const cookies = new Cookies();

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      try {
        // localStorage.setItem("user", JSON.stringify(action.payload?.user));
        const  token  = action.payload?.token?.split("Bearer ")[1]
        //setting the token in the cookies
        const decodedToken = jwt_decode(token)
        state.user = decodedToken;

        const currentTime = Date.now() / 1000;
        const expirationTime = decodedToken.exp;

        // Calculate the time remaining in seconds
        const timeRemaining = expirationTime - currentTime;
        console.log(token);
        cookies.set(
          "session_token",
          token,
          {
            path: "/",
            domain: process.env.REACT_APP_DOMAIN,
            maxAge: timeRemaining
          }
        );


      } catch (error) {
        console.log(error);
      }
    },
    logout: (state, action) => {
    try {
      state.user = null;
      cookies.remove("session_token",{
        path: "/",
        domain: process.env.REACT_APP_DOMAIN,
      });
    } catch (error) {
      console.log(error);
    }
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
