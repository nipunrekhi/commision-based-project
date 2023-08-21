import bcrypt from "bcryptjs";
import { mongoose } from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    ref_email: { type: mongoose.Schema.Types.String, ref: "User" },
  },
  {
    timestamps: true,
  },
  
);

// hash user's password with salt before saving document to db
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if(this.email===process.env.SUPER_ADMIN.toLowerCase()){
    this.role=0
  }
});

// extend matchPassword function unto userSchema
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error(error);
    return false;
  }
};

userSchema.methods.calculateCommission = function (amount) {
  let commission;
  if (this.role === "1") {
    commission = 0.8 * amount;
  } else if (this.role === "2") {
    commission = 0.85 * amount;
  } else if (this.role === "3") {
    commission = 0.9 * amount;
  } else {
    commission = null;
  }
  return commission;
};

const User = mongoose.model("User", userSchema);

export default User;
