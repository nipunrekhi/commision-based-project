import axios from "axios";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8080");
const backendURL = "http://127.0.0.1:8080";

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/api/user/login`,
        { email, password },
        config
      );
      localStorage.setItem("userToken", data.userToken);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    { firstName, email, password, role, ref_email, orgName },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        `${backendURL}/api/user/register`,
        { firstName, email, password, role, ref_email, orgName },
        config
      );
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const editUser = createAsyncThunk("editUser", async (id, data) => {
  const res = await fetch(`${backendURL}/api/user/users/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  return res.json({ data });
});

export const referenceList = createAsyncThunk("referenceList", async () => {
  const res = await fetch(`${backendURL}/api/user/referenceList`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  return res.json();
});

export const updateUsers = createAsyncThunk("updateUser", async (data) => {
  const res = await fetch(`${backendURL}/api/user/updateUser/${data.id}`, {
    method: "PATCH",
    body: JSON.stringify(data.data),
    headers: {
      "Content-type": "application/json",
    },
  });
  return res.json(res);
});

export const userByRef = createAsyncThunk(
  "userByRef",
  async (ref_email, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      return await axios.get(
        `${backendURL}/api/user/agentList/${ref_email}`,
        config
      );
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userOfAgent = createAsyncThunk(
  "userOfAgent",
  async (ref_email, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      return await axios.get(
        `${backendURL}/api/user/userOfAgent/${ref_email}`,
        config
      );
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userDetails = createAsyncThunk("userDetails", async (id, data) => {
  console.log("ok");
  const res = await fetch(`${backendURL}/api/user/details/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  return res.json({ data });
});

export const reqAgentCom = createAsyncThunk(
  "AgentCom",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/api/user/comAgentReq/${id}`,
        config
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const reqCom = createAsyncThunk(
  "reqCom",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/api/user/comUserReq/${id}`,
        config
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const requestApprove = createAsyncThunk(
  "requestApprove",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(
        `${backendURL}/api/user/requestApprove`,
        config
      );
      return res;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const sendCom = createAsyncThunk("sendCom", async (data) => {
  const token = localStorage.getItem("userToken");
  const res = await axios.post(`${backendURL}/api/user/sendCom`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json({ data });
});

export const sendUserCom = createAsyncThunk("sendUserCom", async (data) => {
  const token = localStorage.getItem("userToken");
  const res = await axios.post(`${backendURL}/api/user/sendUserCom`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json({ data });
});

export const renew = createAsyncThunk(
  "renew",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`${backendURL}/api/user/renew`, config);
      return res;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const reopenAccount = createAsyncThunk("reopenAccount", async (data) => {
  const token = localStorage.getItem("userToken");
  const res = await axios.post(`${backendURL}/api/user/reopenAccount`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json({ data });
});

export const displayShare = createAsyncThunk(
  "displayShare",
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(
        `${backendURL}/api/user/displayShare`,
        config
      );
      return res;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const shareInsert = createAsyncThunk(
  "shareInsert",
  async (totalShares) => {
    const token = localStorage.getItem("userToken");
    const res = await axios.post(
      `${backendURL}/api/user/shareInsert`,
      { totalShares },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res;
  }
);

export const buyShares = createAsyncThunk("buyShares", async (id) => {
  const token = localStorage.getItem("userToken");
  return await fetch(`${backendURL}/api/user/buyShares/${id}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
});

export const bid = createAsyncThunk("bid", async (data) => {
  const token = localStorage.getItem("userToken");
  return await fetch(`${backendURL}/api/user/bid`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json({ data }));
});

export const displayBid = createAsyncThunk(
  "displayBid",
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(`${backendURL}/api/user/displayBid`, config);
      socket.emit("display_bid", res);
      return res;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const startBid = createAsyncThunk(
  "startBid",
  async (
    { bidId, bidPrice, shareHolderName, sharePercentage, sharePrice, email },
    { dispatch }
  ) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `${backendURL}/api/user/startBid/${bidId}`,
        {
          bidId,
          bidPrice,
          shareHolderName,
          sharePercentage,
          sharePrice,
          email,
        },
        { headers }
      );
      dispatch(highestBidPrice());
      dispatch(displayBid());
      dispatch(showBid());
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const showBid = createAsyncThunk(
  "showBid",
  async (data, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(`${backendURL}/api/user/showBid`, config);
      return res;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const highestBidPrice = createAsyncThunk("highestBidPrice", async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(`${backendURL}/api/user/highestBid`, {
      headers,
    });
    return  response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// export const highestBidPrice = createAsyncThunk(
//   "highestBidPrice",
//   async (_, { rejectWithValue }) => {
//     return new Promise((resolve, reject) => {
//       // Listen for the "highestBid" event from the server
//       socket.on("highestBid", (data) => {

//         // Resolve the promise with the received data
//         resolve(data);
//       });

//       // If an error occurs, reject the promise with the error message
//       socket.on("error", (err) => {
//         reject(rejectWithValue(err.message));
//       });

//       // Make the Axios request
//       const headers = {
//         "Content-Type": "application/json",
//       };
//       axios
//         .get(`${backendURL}/api/user/highestBid`, { headers })
//         .then((response) => {
//           console.log(response);
//           // Emit a "highestBidRequest" event to the server with the response data
//           socket.emit("highestBidRequest", response.data);
//         })
//         .catch((error) => {
//           console.error(error);
//           reject(rejectWithValue(error.message));
//         });
//     });
//   }
// );

export const highestBidWinner = createAsyncThunk(
  "highestBidWinner",
  async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${backendURL}/api/user/highestBidWinner`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const purchaseBid = createAsyncThunk(
  "purchaseBid",
  async (bidId, { dispatch }) => {
    const token = localStorage.getItem("userToken");
    return await fetch(`${backendURL}/api/user/purchaseBid/${bidId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json());
  }
);

export const deletExpiredBid = createAsyncThunk("deletExpiredBid", async () => {
  return await fetch(`${backendURL}/api/user/deletExpiredBid`, {
    method: "GET",
  }).then((response) => response.json());
});
