import { mongoose } from "mongoose";

const organisationSchema = new mongoose.Schema({
  user_Id:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
  userEmail: { type: String, ref: "User" },
  orgName: {
    type: String,
  },
  orgCom: {
    type: Number,
  }
});

const Organisation = mongoose.model("Organisation", organisationSchema);
export default Organisation;
