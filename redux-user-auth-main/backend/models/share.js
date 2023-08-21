import { mongoose } from "mongoose";

const shareSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  totalShares: { type: Number, default: 10 },
  // sharesRemaning: { type: Number, default: 10 },
  sharePrize: Number,
});
const shares = mongoose.model("shares", shareSchema);
export default shares;
