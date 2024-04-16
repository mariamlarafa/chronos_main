import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  avatarColors:[
    "light-green",
    "orange",
    "dark-green",
    "black",
    "bright-orange",
  ]
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { user, profile } = action?.payload;
      state.user = user;
      state.profile = profile;
    },
    removeUserInfoFromState: (state, action) => {
      state.userinfo = null;
    },
    updateUserInfoProfile:(state,action)=>{
      const attToUpdate= action.payload
      Object.keys(attToUpdate).forEach((key)=>{
        state.profile[key]=attToUpdate[key]
      })

    },
  }
});

export const { setUserInfo, removeUserInfoFromState,updateUserInfoProfile } = userSlice.actions;

export default userSlice.reducer;
