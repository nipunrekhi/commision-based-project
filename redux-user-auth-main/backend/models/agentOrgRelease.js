import { mongoose } from "mongoose";
const agentOrgReleaseSchema = new mongoose.Schema({
  userId :{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  agentEmail: { type: String, ref: "User" },
  Role: String,
  requestApproved: {type:Boolean,default:false},
});

const agentOrgRelease = mongoose.model(
  "agentOrgRelease",
  agentOrgReleaseSchema
);
export default agentOrgRelease;
