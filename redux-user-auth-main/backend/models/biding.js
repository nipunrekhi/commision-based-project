import {mongoose} from "mongoose"

const bidingSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  shareHolderName:{type:String},
  userEmail: { type: String, ref: "User" },
  sharePercentage: Number,
  sharePrice: Number,
});

const biding = mongoose.model("biding", bidingSchema);
export default  biding;
