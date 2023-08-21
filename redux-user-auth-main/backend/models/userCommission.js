import { mongoose } from "mongoose";

const userCommissionSchema = new mongoose.Schema({
  ReferalEmail: {
    type: String,
    ref: "User",
  },
  superAdminCom: { type: String },
  adminCom: { type: String },
  agentCom: { type: String },
  userCom: { type: String },
});

const UserCommission = mongoose.model("UserCommission", userCommissionSchema);
export default UserCommission;
