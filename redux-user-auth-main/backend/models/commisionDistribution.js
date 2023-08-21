import { mongoose } from "mongoose";

const commissionDistributionSchema = new mongoose.Schema({
  userEmail: { type: String, ref: "User" },
  ReferalEmail: { type: String, ref: "User" },
  superAdminCom: {
    type: Number,
  },
  adminCom: {
    type: Number
  },
  agentCom: {
    type: Number
  },
});

const comdistribution = mongoose.model(
  "ComDistribution",
  commissionDistributionSchema
);
export default comdistribution;
