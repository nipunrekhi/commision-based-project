import { mongoose } from "mongoose";

const orgReleaseSchema = new mongoose.Schema({
  email: { type: String, ref: "User" },
  referal: { type: String, ref: "User" },
  agentCommission: { type: Number },
  userCommission: { type: Number },
});

const orgRelease = mongoose.model("orgRelease", orgReleaseSchema);
export default orgRelease;
