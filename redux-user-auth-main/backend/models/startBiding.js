import { mongoose } from "mongoose";
const startBidSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: "biding" },
  shareHolderName: { type: String, ref: "User" },
  userEmail: { type: String, ref: "User" },
  sharePercentage: Number,
  sharePrice: Number,
  bidPrice: Number,
  dateTime: Date,
  endTime: Date,
});

const startBid = mongoose.model("startBid", startBidSchema);
export default startBid;
