import { createSlice } from '@reduxjs/toolkit';

// import * as actions from './action';

const initialState = {
  userInfo: {},
};

export const appSlice = createSlice({
  name: 'app-userinfo',
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    setUserInfo: (state, action) => ({
      ...state,
      userInfo: action.payload,
    }),
  },
});

export const { setUserInfo } = appSlice.actions;

export default appSlice.reducer;
