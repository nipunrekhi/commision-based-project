import expressAsyncHandler from "express-async-handler";
import Commission from "../models/commissionModel.js";
import Organisation from "../models/organisationModel.js";
import User from "../models/userModel.js";
import agentOrgRelease from "../models/agentOrgRelease.js";
import userOrgRelease from "../models/userOrgRelease.js";
import UserCommission from "../models/userCommission.js";
import orgRelease from "../models/orgRelease.js";

const commissionRequestAgent = expressAsyncHandler(async (req, res) => {
  let agentCount;
  const user = await User.findById(req.params.id);

  const orgId = await Organisation.findOne({ userEmail: user.ref_email });

  const userExist = await agentOrgRelease.findOne({ userId: user._id });

  if (userExist) {
    res.status(404);
    throw new Error(" Users already Requested");
  }

  agentCount = await agentOrgRelease.find({ orgId: orgId._id }).count();
  if (agentCount === 3) {
    res.status(404);
    throw new Error("Three Users already Requested");
  } else {
    var otherModelData = new agentOrgRelease({
      orgId: orgId._id,
      userId: user._id,
      agentEmail: user.email,
      Role: user.role,
    });
  }

  await otherModelData.save();
  res.send({ data: otherModelData });
});

const commissionRequestUser = expressAsyncHandler(async (req, res) => {
  let userCount;
  let orgId;
  let orgName;
  let orgcommission;

  await User.findById(req.params.id).then(async (d) => {
    await User.find({ email: d.ref_email }).then(async (d) => {
      await Organisation.findOne({ userEmail: d[0].ref_email }).then(
        async (d) => {
          orgId = d._id;
          orgName = d.orgName;
          orgcommission = d.orgCom;
        }
      );
    });
  });

  const user = await User.findById(req.params.id);

  const userExist = await userOrgRelease.findOne({ userId: user._id });
  if (userExist) {
    res.status(404);
    throw new Error(" Users already Requested");
  }

  userCount = await userOrgRelease.find({ orgId: orgId }).count();

  if (userCount === 3) {
    res.status(404);
    throw new Error("Three Users already Requested");
  } else {
    var otherModelData = new userOrgRelease({
      orgId: orgId,
      userId: user._id,
      userEmail: user.email,
      Role: user.role,
    });
  }

  await otherModelData.save();
  res.send({ data: otherModelData });
});

const requestApprove = expressAsyncHandler(async (req, res) => {
  let sendCommission;
  let agentCount;
  let userCount;
  let approvedAgentDocs;
  let approvedUserDocs;
  let CommissionSent = false;
  let UserCommissionSent = false;

  const user = await User.findById(req.user._id);

  const orgId = await Organisation.findOne({ userEmail: user.email });

  //Checking Agent And User Request Count
  agentCount = await agentOrgRelease
    .find({ orgId: orgId._id }, { requestApproved: 1 })
    .count();
  userCount = await userOrgRelease.find({ orgId: orgId._id }).count();
  approvedAgentDocs = await agentOrgRelease.findOne(
    { orgId: orgId._id },
    { requestApproved: 1 }
  );
  approvedUserDocs = await userOrgRelease.findOne(
    { orgId: orgId._id },
    { requestApproved: 1 }
  );

  //Admin Send Commission Successfully To Agent

  if (approvedAgentDocs == null) {
  }
  if (approvedAgentDocs != null) {
    if (approvedAgentDocs.requestApproved === true) {
      CommissionSent = true;
    }
  } else {
    CommissionSent;
  }

  //Admin Send Commission Successfully To User
  if (approvedUserDocs == null) {
  }
  if (approvedUserDocs != null) {
    if (approvedUserDocs.requestApproved == true) UserCommissionSent = true;
  } else {
    UserCommissionSent;
  }
  // Admin Send Commission When 3 User And Agent Sent request For Commission
  // if (agentCount === 3 || userCount === 3) {
  //   sendCommission = true;
  // } else {
  //   sendCommission = false;
  // }

  res.send({
    sendCommission,
    userCount,
    CommissionSent,
    UserCommissionSent,
    agentCount,
  });
});

const sendCommission = expressAsyncHandler(async (req, res) => {
  let lastOrgCom;
  let orgRel;
  let newOrgCom;
  let Dist;
  let Emails = [];
  let email;
  let email1;
  let email2;

  const user = await User.findById(req.user._id);
  const org = await Organisation.findOne({ userEmail: user.email });
  await agentOrgRelease
    .find({ orgId: org._id }, { agentEmail: 1, _id: 0 })
    .then((d) => {
      email = d[0].agentEmail;
      email1 = d[1].agentEmail;
      email2 = d[2].agentEmail;
    });
  Emails = [email, email1, email2];

  if (user.role == 1) {
    lastOrgCom = org.orgCom;
    orgRel = lastOrgCom * 0.4;
    Dist = orgRel / 3;
    newOrgCom = lastOrgCom - orgRel;
    await Organisation.updateOne(
      { _id: org._id },
      { $set: { orgCom: newOrgCom } }
    );
    for (var i = 0; i < Emails.length; i++) {
      var sendCom = await orgRelease.create({
        referal: user.email,
        email: Emails[i],
        agentCommission: Dist,
      });
      var updateReqApprove = await agentOrgRelease.updateOne(
        { agentEmail: Emails[i] },
        { $set: { requestApproved: true } }
      );
    }
  }
  res.send({ sendCom, updateReqApprove });
});

const sendUserCommission = expressAsyncHandler(async (req, res) => {
  let lastOrgCom;
  let orgRel;
  let newOrgCom;
  let Dist;
  let Emails = [];
  let email;
  let email1;
  let email2;

  const user = await User.findById(req.user._id);
  const org = await Organisation.findOne({ userEmail: user.email });
  await userOrgRelease
    .find({ orgId: org._id }, { userEmail: 1, _id: 0, requestApproved: 1 })
    .then((d) => {
      email = d[0].userEmail;
      email1 = d[1].userEmail;
      email2 = d[2].userEmail;
    });
  Emails = [email, email1, email2];

  if (user.role == 1) {
    lastOrgCom = org.orgCom;
    orgRel = lastOrgCom * 0.2;
    Dist = orgRel / 3;
    newOrgCom = lastOrgCom - orgRel;
    await Organisation.updateOne(
      { _id: org._id },
      { $set: { orgCom: newOrgCom } }
    );
    for (var i = 0; i < Emails.length; i++) {
      var sendCom = await orgRelease.create({
        referal: user.email,
        email: Emails[i],
        userCommission: Dist,
      });
      var updateReqApprove = await userOrgRelease.updateOne(
        { userEmail: Emails[i] },
        { $set: { requestApproved: true } }
      );
    }
  }
  res.send({ sendCom, updateReqApprove });
});

const renew = expressAsyncHandler(async (req, res) => {
  let renew = false;
  let renewUser = false;
  let userpending = false;
  let agentpending = false;

  const user = await User.findById(req.user._id);
  const agentorgrelease = await agentOrgRelease.findOne({
    agentEmail: user.email,
  });
  const userorgrelease = await userOrgRelease.findOne({
    userEmail: user.email,
  });

  if (user.role == 2 && agentorgrelease != null) {
    if (agentorgrelease.requestApproved == true) {
      renew = true;
    } else {
      renew;
    }
    if (agentorgrelease.requestApproved === false) {
      agentpending = true;
    } else {
      agentpending;
    }

    res.send({ renew, agentpending });
  } else {
  }
  if (user.role == 3 && userorgrelease != null) {
    if (userorgrelease.requestApproved == true) {
      renewUser = true;
    } else {
      renewUser;
    }
    if (userorgrelease.requestApproved == false) {
      userpending = true;
    } else {
      userpending;
    }
    res.send({ renewUser, userpending });
  } else {
  }
});

const reopenAccount = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role == 2) {
    let agentOrgCom;
    let orgid;
    const agent = await agentOrgRelease.find({ agentEmail: user.email });
    let popped_object = agent.pop();
    await Organisation.find({ _id: popped_object.orgId }).then((d) => {
      agentOrgCom = d[0].orgCom;
      orgid = d[0]._id;
    });
    const commission = user.calculateCommission(800);
    let newOrgCommission = commission + agentOrgCom;
    if (popped_object.agentEmail == user.email) {
      var data = await Organisation.updateOne(
        { _id: orgid },
        { $set: { orgCom: newOrgCommission } }
      );
      var del = await agentOrgRelease.deleteOne({ userId: user._id });
    }
    res.send({
      status: 200,
      message: "User Renew Account Successfully",
      del,
      data,
    });
  } else if (user.role == 3) {
    let userOrgCom;
    let orgid;
    const userRequest = await userOrgRelease.findOne({ userEmail: user.email });
    await Organisation.findOne({ _id: userRequest.orgId }).then((d) => {
      userOrgCom = d.orgCom;
      orgid = d._id;
    });
    const commission = user.calculateCommission(500);
    let newOrgCommission = commission + userOrgCom;
    if (userRequest.userEmail == user.email) {
      var data = await Organisation.updateOne(
        { _id: orgid },
        { $set: { orgCom: newOrgCommission } }
      );
      var del = await userOrgRelease.deleteOne({ userId: user._id });
    }
    res.send({
      status: 200,
      message: "User Renew Account Successfully",
      del,
      data,
    });
  }
});

export {
  commissionRequestAgent,
  commissionRequestUser,
  requestApprove,
  sendCommission,
  sendUserCommission,
  renew,
  reopenAccount,
};
