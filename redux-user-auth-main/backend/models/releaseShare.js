import {mongoose} from "mongoose"

const releaseShareSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  userEmail: { type: mongoose.Schema.Types.String, ref: "User" },
  sharePercentage: Number,
  shareRequest: { type: Boolean, default: false },
});

const releaseShare = new mongoose.model("releaseShare", releaseShareSchema);

export default releaseShare;
