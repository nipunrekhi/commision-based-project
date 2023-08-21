import { mongoose } from "mongoose";
const userOrgReleaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  userEmail: { type: String, ref: "User" },
  Role: String,
  requestApproved: {type:Boolean,default:false},
});



const userOrgRelease = mongoose.model("userOrgRelease", userOrgReleaseSchema);
export default userOrgRelease;
