import { mongoose } from "mongoose";

const commissionModelSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation" },
  commission: { type: String },
  userEmail: { type: String, ref: "User" },
  Reference: { type: String, ref: "User" },
  Role:{type:String}
});

const Commission = mongoose.model("Commission", commissionModelSchema);
export default Commission;
