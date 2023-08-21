import asyncHandler from "express-async-handler";
import Organisation from "../models/organisationModel.js";
import shares from "../models/share.js";
import User from "../models/userModel.js";
import releaseShare from "../models/releaseShare.js";

const shareInsert = asyncHandler(async (req, res) => {
  let sharePrize;
  let orgid;
  let insertedShare = req.body.totalShares;
  let Max_Share_PERCENTAGE = 40;
  try {
    const user = await User.findById(req.user._id);
    await Organisation.findOne({ user_Id: user._id }).then((d) => {
      orgid = d._id;
      sharePrize = (d.orgCom * 1) / 100;
    });
    const shareExist = await shares.findOne({ userId: user._id });
    if (shareExist) {
      if (shareExist.totalShares + insertedShare > Max_Share_PERCENTAGE) {
        res.status(400).json("You can't have more than 40% of the shares");
      } else if (shareExist.userId) {
        await shares.updateOne(
          { _id: shareExist._id },
          { $set: { totalShares: shareExist.totalShares + insertedShare } }
        );
        res.status(200).send({ message: "Shares Updated" });
      }
    } else {
      await shares
        .create({
          userId: user._id,
          orgId: orgid,
          sharePrize: Math.trunc(sharePrize),
          totalShares: req.body.totalShares,
        })
        .then((d) => {
          if (d.length != 0) {
            res.send({ status: 200, shareAval: false, data: d });
          } else {
            res.send({ status: 200, shareAval: true });
          }
        });
    }
  } catch (err) {
    res.status(404);
    throw new Error();
  }
});

const displayShares = asyncHandler(async (req, res) => {
  let orgNames = [];
  let data;
  try {
    await shares.find({}).then(async (d) => {
      data = d;
      for (let i = 0; i < data.length; i++) {
        var a = await Organisation.findOne({ _id: data[i].orgId });
        orgNames.push(a.orgName);
      }
    });

    if (data.length != 0) {
      res.send({ status: 200, data: data, orgNames: orgNames });
    } else {
      res.send({ status: 200, data: null, orgNames: null });
    }
  } catch (err) {
    res.send({ status: 404, data: err });
  }
});

const buyShares = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const share = await shares.findById(req.params.id);
  if (user._id.toString() === share.userId.toString()) {
    res.status(401).json({ message: "You cant buy your own shares" });
  } else {
     await releaseShare.create({
      orgId: share.orgId,
      userEmail: user.email,
      sharePercentage: share.totalShares,
    });
   await share.deleteOne({ _id: share._id });
    res.status(200).json({ message: "Shares Buy Succesfully" });
  }
});

export { shareInsert, displayShares, buyShares };

