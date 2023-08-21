import { createSlice } from '@reduxjs/toolkit';
import {
  registerUser,
  userLogin,
  editUser,
  userByRef,
  userOfAgent,
  referenceList,
  updateUsers,
  userDetails,
  reqCom,
  reqAgentCom,
  requestApprove,
  sendCom,
  sendUserCom,
  renew,
  reopenAccount,
  displayShare,
  shareInsert,
  buyShares,
  bid,
  displayBid,
  startBid,
  showBid,
  highestBidPrice,
  highestBidWinner,
  purchaseBid,
  deletExpiredBid,
} from './authActions';



// initialize userToken from local storage
const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null;

const initialState = {
  message: null,
  loading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
  data: null,
  sendCommission: null,
  showBidData: null,
  highestBid: null,
  highestBidWinner:null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken"); // delete token from storage
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.data = null;
    },
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
      console.log(payload,"payload");
      state.success = true;
      state.error = null;
      state.loading = false;
    },
    setUserList: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.data = payload;
    },
  
  },
  extraReducers: {
    // login user
    [userLogin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
      state.userToken = payload.userToken;
      state.success = true;
      state.error = null;
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // register user
    [registerUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true; // registration successful
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [editUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [editUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload;
    },
    [editUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [userByRef.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userByRef.fulfilled]: (state, { payload }) => {
      state.data = payload?.data;
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [userByRef.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [userOfAgent.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userOfAgent.fulfilled]: (state, { payload }) => {
      state.data = payload?.data;
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [userOfAgent.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [referenceList.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [referenceList.fulfilled]: (state, { payload }) => {
      state.data = payload.data;
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [referenceList.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [updateUsers.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateUsers.fulfilled]: (state, { payload }) => {
      state.data = payload.data;
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [updateUsers.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [userDetails.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userDetails.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload;
    },
    [userDetails.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [reqCom.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [reqCom.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload;
    },
    [reqCom.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [reqAgentCom.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [reqAgentCom.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [reqAgentCom.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [requestApprove.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [requestApprove.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload.data;
      state.sendCommission = payload.data;
    },
    [requestApprove.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [sendCom.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [sendCom.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload;
    },
    [sendCom.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [sendUserCom.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [sendUserCom.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload;
    },
    [sendUserCom.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    [renew.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [renew.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload.data;
    },
    [renew.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    [reopenAccount.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [reopenAccount.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload.data;
    },
    [reopenAccount.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    [displayShare.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [displayShare.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload.data;
    },
    [displayShare.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [shareInsert.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [shareInsert.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload;
    },
    [shareInsert.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [buyShares.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [buyShares.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.message = payload.message;
      state.error = null;
    },
    [buyShares.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [bid.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [bid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [bid.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [displayBid.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [displayBid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload.data;
    },
    [displayBid.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [startBid.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [startBid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.data = payload.data;
    },
    [startBid.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [showBid.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [showBid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.showBidData = payload.data;
    },
    [showBid.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [highestBidPrice.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [highestBidPrice.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.highestBid = payload;
    },
    [highestBidPrice.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [highestBidWinner.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [highestBidWinner.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.highestBidWin = payload;
    },
    [highestBidWinner.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [purchaseBid.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [purchaseBid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [purchaseBid.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [deletExpiredBid.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deletExpiredBid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    [deletExpiredBid.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});


export const { logout, setCredentials, setUserList } = authSlice.actions;


export default authSlice.reducer;
