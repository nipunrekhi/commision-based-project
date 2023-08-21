import asyncHandler from "express-async-handler";
import mongoose, { Mongoose } from "mongoose";
import comdistribution from "../models/commisionDistribution.js";
import Commission from "../models/commissionModel.js";
import Organisation from "../models/organisationModel.js";
import UserCommission from "../models/userCommission.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import orgRelease from "../models/orgRelease.js";
import releaseShare from "../models/releaseShare.js";

const registerUser = asyncHandler(async (req, res) => {
  let orgId;
  let orgCom;
  let userReference;
  let refEmail;
  let adId;
  let agId;
  let admincom;
  let agentCom;
  let superAdminCom;
  let user_Id;

  const { firstName, email, password, role, ref_email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    email,
    password,
    role,
    ref_email,
  });
  if (user) {
    res.status(201).json({
      user: user,
    });
    const regUser = await User.findOne().sort({ _id: -1 }).limit(1);

    if (regUser.role == "1") {
      const commission = user.calculateCommission(1000);
      await Organisation.create({
        user_Id: regUser._id,
        userEmail: regUser.email,
        orgName: req.body.orgName,
        orgCom: commission,
      });

      await comdistribution.create({
        userEmail: regUser.email,
        ReferalEmail: regUser.ref_email,
        superAdminCom: 0.2 * 1000,
      });
      await Commission.create({
        orgId: orgId,
        userEmail: regUser.email,
        Reference: regUser.ref_email,
        commission: commission,
        Role: regUser.role,
      });

      const userCom = await UserCommission.findOne({
        ReferalEmail: regUser.ref_email,
      });
      if (!userCom) {
        await UserCommission.create({
          ReferalEmail: regUser.ref_email,
          superAdminCom: 0.2 * 1000,
        });
      } else {
        let userId = userCom._id;
        await UserCommission.findOne(req.body).then((d) => {
          superAdminCom = d.superAdminCom;
        });
        let newSupCom = parseInt(superAdminCom) + 0.2 * 1000;
        await UserCommission.updateOne(
          { userId },
          { $set: { superAdminCom: newSupCom } }
        );
      }
      await Organisation.find({ userEmail: regUser.email }).then((d) => {
        orgId = d[0]._id;
      });
    } else if (regUser.role == "2") {
      let orgDetail = await Organisation.findOne({
        userEmail: regUser.ref_email,
      });
      orgId = orgDetail._id;
      orgCom = orgDetail.orgCom;
      let newComm = orgCom + user.calculateCommission(800);
      let Com = user.calculateCommission(800);

      await Organisation.updateOne(
        { _id: orgId },
        { $set: { orgCom: newComm } }
      );
      await comdistribution.create({
        userEmail: regUser.email,
        ReferalEmail: regUser.ref_email,
        adminCom: 0.15 * 800,
      });

      await Commission.create({
        orgId: orgId,
        userEmail: regUser.email,
        Reference: regUser.ref_email,
        commission: Com,
        Role: regUser.role,
      });

      const userCom = await UserCommission.findOne({
        ReferalEmail: regUser.ref_email,
      });

      if (!userCom) {
        await UserCommission.create({
          user_Id: regUser._id,
          ReferalEmail: regUser.ref_email,
          adminCom: 0.15 * 800,
        });
      } else {
        await UserCommission.findOne({
          ReferalEmail: regUser.ref_email,
        }).then((d) => {
          refEmail = d.ReferalEmail;
          adId = d._id;
          admincom = d.adminCom;
        });
        if (refEmail) {
          let newAdminCom = parseInt(admincom) + 0.15 * 800;
          await UserCommission.updateOne(
            { _id: adId },
            { $set: { adminCom: newAdminCom } }
          );
        } else {
          await UserCommission.create({
            ReferalEmail: regUser.ref_email,
            adminCom: 0.15 * 800,
          });
        }
      }
    } else if (regUser.role == "3") {
      userReference = await User.findOne({
        email: regUser.ref_email,
      });
      let orgDetail = await Organisation.findOne({
        userEmail: userReference.ref_email,
      });
      orgId = orgDetail._id;
      orgCom = orgDetail.orgCom;
      let newComm = orgCom + user.calculateCommission(500);
      let Com = user.calculateCommission(500);
      await Organisation.updateOne(
        { _id: orgId },
        { $set: { orgCom: newComm } }
      );
      await comdistribution.create({
        userEmail: regUser.email,
        ReferalEmail: regUser.ref_email,
        agentCom: 0.1 * 500,
      });
      await Commission.create({
        orgId: orgId,
        userEmail: regUser.email,
        Reference: regUser.ref_email,
        commission: Com,
        Role: regUser.role,
      });

      const userCom = await UserCommission.findOne({
        ReferalEmail: regUser.ref_email,
      });

      if (!userCom) {
        await UserCommission.create({
          user_Id: regUser._id,
          ReferalEmail: regUser.ref_email,
          agentCom: 0.1 * 500,
        });
      } else {
        await UserCommission.findOne({
          ReferalEmail: regUser.ref_email,
        }).then((d) => {
          refEmail = d.ReferalEmail;
          agId = d._id;
          agentCom = d.agentCom;
        });
        if (refEmail) {
          let newAgentCom = parseInt(agentCom) + 0.1 * 500;
          await UserCommission.updateOne(
            { _id: agId },
            { $set: { agentCom: newAgentCom } }
          );
        } else {
          await UserCommission.create({
            ReferalEmail: regUser.ref_email,
            agentCom: 0.1 * 500,
          });
        }
      }
    }
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user email exists in db
  const user = await User.findOne({ email });
  const orgCommission = await Organisation.findOne({ userEmail: email });
  const userCom = await UserCommission.findOne({ ReferalEmail: email });

  // return user obj if their password matches
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  } else if (user.role == 0 && (await user.matchPassword(password))) {
    if (userCom == null) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        userToken: generateToken(
          user._id,
          user.role,
          user.ref_email,
          user.email
        ),
      });
    } else {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        superAdminCom: userCom.superAdminCom,

        userToken: generateToken(
          user._id,
          user.role,
          user.ref_email,
          user.email,
          userCom.superAdminCom
        ),
      });
    }
  } else if (user.role == 1 && (await user.matchPassword(password))) {
    if (userCom == null) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        orgCom: orgCommission.orgCom,
        orgName: orgCommission.orgName,
        userToken: generateToken(
          user._id,
          user.role,
          user.ref_email,
          user.email,
          orgCommission.orgCom,
          orgCommission.orgName
        ),
      });
    } else {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        orgCom: orgCommission.orgCom,
        orgName: orgCommission.orgName,
        superAdminCom: userCom.superAdminCom,
        adminCom: userCom.adminCom,
        userToken: generateToken(
          user._id,
          user.role,
          user.ref_email,
          user.email,
          orgCommission.orgCom,
          orgCommission.orgName,
          userCom.superAdminCom,
          userCom.adminCom
        ),
      });
    }
  } else if (user.role == 2 && (await user.matchPassword(password))) {
    if (userCom == null) {
      let data = {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
      };
      let userToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        userToken,
      });
    } else if (userCom) {
      let data = {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        agentCom: userCom.agentCom,
      };
      let userToken = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        agentCom: userCom.agentCom,
        userToken,
      });
    }
  } else {
    let data = {
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      ref_email: user.ref_email,
    };
    let userToken = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    res.json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      ref_email: user.ref_email,
      userToken,
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
  const user = await User.findById(req.user._id);
  const orgCommission = await Organisation.findOne(req.Organisation);
  const userCom = await UserCommission.findOne(req.UserCommission);
  const org = await orgRelease.findOne({ email: user.email });
  const share = await releaseShare.findOne({ userEmail: user.email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else if (user.role == 0) {
    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      superAdminCom: userCom.superAdminCom,
    });
  } else if (user.role == 1) {
    if (share) {
      res.json({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        orgCom: Math.trunc(orgCommission.orgCom),
        orgName: orgCommission.orgName,
        adminCom: userCom.adminCom,
        share: share.sharePercentage,
      });
    } else {
      res.json({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        orgCom: Math.trunc(orgCommission.orgCom),
        orgName: orgCommission.orgName,
        adminCom: userCom.adminCom,
        share: 0,
      });
    }
  } else if (user.role == 2 && org && share) {
    if (userCom.agentCom == undefined) {
      res.json({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        agentCom: org.agentCommission,
      });
    } else {
      res.json({
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        ref_email: user.ref_email,
        agentCom: parseInt(userCom.agentCom) + parseInt(org.agentCommission),
        share: share.sharePercentage,
      });
    }
  } else if (user.role == 2 && !org) {
    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      ref_email: user.ref_email,
      agentCom: userCom.agentCom,
    });
  } else if (user.role == 3 && org && share) {
    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      ref_email: user.ref_email,
      userCom: org.userCommission,
      share: share.sharePercentage,
    });
  } else {
    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      ref_email: user.ref_email,
      share: 0,
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const role = req.user.role;
  if (role == 0) {
    await User.find(req.res)
      .skip(1)
      .then((user) => {
        if (user) {
          res.json({
            user,
          });
        } else {
          res.status(404);
          throw new Error("No Data Found");
        }
      });
  }
});

const getAgents = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const refemail = req.params.ref_email;
  if (email == refemail) {
    await User.find({ ref_email: refemail }).then((d) => {
      if (d) {
        res.json({
          data: d,
        });
      } else {
        res.status(404);
        throw new Error("No Data Found");
      }
    });
  }
});

const getUserOfAgent = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const refemail = req.params.ref_email;
  if (email == refemail) {
    await User.find({ ref_email: refemail }).then((d) => {
      if (d) {
        res.json({
          data: d,
        });
      } else {
        res.status(404);
        throw new Error("No Data Found");
      }
    });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      data: user,
    });
  } else {
    res.status(404);
    throw new Error("No Data Found");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const set = req.body;
  const user = await User.updateOne({ _id: id }, { $set: set });
  if (user) {
    res.json({
      data: user,
      message: "Data Updated",
    });
  } else {
    res.status(404);
    throw new Error("Data Not Updated");
  }
});

const referenceList = async (req, res) => {
  try {
    await User.find(req.body.role, { _id: 0, name: 1, email: 1 })
      .then((d) => {
        res.send({ status: 200, data: d });
      })
      .catch((e) => {
        res.send({ status: 404, msg: e, data: null });
      });
  } catch (err) {
    console.log(err);
  }
};

const details = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const userCom = await UserCommission.findOne({ ReferalEmail: user.email });
  const org = await Organisation.findOne({ userEmail: user.email });
  const comUser = await orgRelease.findOne({ email: user.email });

  if (user.role == 1 && userCom == null) {
    res.send({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      ref_email: user.ref_email,
      role: user.role,
      orgName: org.orgName,
      orgCom: org.orgCom,
    });
  } else if (user.role == 1 && userCom != null) {
    res.send({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      ref_email: user.ref_email,
      role: user.role,
      orgName: org.orgName,
      orgCom: org.orgCom,
      adminCom: userCom.adminCom,
    });
  } else if (user.role == 2 && userCom == null && org == null) {
    res.send({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      ref_email: user.ref_email,
      role: user.role,
    });
  } else if (user.role == 2 && userCom != null && org == null) {
    res.send({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      ref_email: user.ref_email,
      role: user.role,
      agentCom: userCom.agentCom,
    });
  } else if (user.role == 3 && comUser == null) {
    res.send({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      ref_email: user.ref_email,
      role: user.role,
      userCom: 0,
    });
  } else {
    res.send({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      ref_email: user.ref_email,
      role: user.role,
      userCom: comUser.userCommission,
    });
  }
});

export {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  getUserById,
  getAgents,
  updateUser,
  getUserOfAgent,
  referenceList,
  details,
};
