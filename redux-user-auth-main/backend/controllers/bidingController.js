import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import releaseShare from "../models/releaseShare.js";
import biding from "../models/biding.js";
import Organisation from "../models/organisationModel.js";
import startBid from "../models/startBiding.js";

const bid = asyncHandler(async (req, res) => {
  let sharePercent;
  let orgCom;
  let orgId;
  const user = await User.findOne(req.user._id);
  const bidExist = await biding.findOne({ userEmail: user.email });
  if (bidExist) {
    res.status(401).send({ message: "Invalid Request" });
  } else if (user.role == 1) {
    await releaseShare.findOne({ userEmail: user.email }).then((d) => {
      sharePercent = d.sharePercentage;
    });
    await Organisation.findOne({ userEmail: user.email }).then((d) => {
      orgId = d._id;
      orgCom = (d.orgCom * 1) / 100;
    });

    let bid = await biding.create({
      orgId: orgId,
      shareHolderName: user.firstName,
      userEmail: user.email,
      sharePercentage: sharePercent,
      sharePrice: sharePercent * orgCom,
    });
    res.status(200).send({ data: bid, message: "Bid Start SuccesFully" });
  } else if (user.role == 2) {
    await releaseShare.findOne({ userEmail: user.email }).then((d) => {
      sharePercent = d.sharePercentage;
    });
    await Organisation.findOne({ userEmail: user.ref_email }).then((d) => {
      orgId = d._id;
      orgCom = (d.orgCom * 1) / 100;
    });

    let bid = await biding.create({
      orgId: orgId,
      userEmail: user.email,
      shareHolderName: user.firstName,
      sharePercentage: sharePercent,
      sharePrice: sharePercent * orgCom,
    });
    res.status(200).send({ data: bid, message: "Bid Start SuccesFully" });
  } else {
    await releaseShare.findOne({ userEmail: user.email }).then((d) => {
      sharePercent = d.sharePercentage;
    });
    await User.findById(req.user._id).then(async (d) => {
      await User.find({ email: d.ref_email }).then(async (d) => {
        await Organisation.findOne({ userEmail: d[0].ref_email }).then(
          async (d) => {
            orgId = d._id;
            orgCom = (d.orgCom * 1) / 100;
          }
        );
      });
    });

    let bid = await biding.create({
      orgId: orgId,
      userEmail: user.email,
      shareHolderName: user.firstName,
      sharePercentage: sharePercent,
      sharePrice: sharePercent * orgCom,
    });
    res.status(200).send({ data: bid, message: "Bid Start SuccesFully" });
  }
});

const displayBid = asyncHandler(async (req, res) => {
  let orgNames = [];
  let data;
  try {
    await biding.find({}).then(async (d) => {
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

const showBid = asyncHandler(async (req, res) => {
  try {
    let data = await startBid.find({});
    if (data) {
      res.status(200).send({ data: data });
    } else {
      res.status(404).send({ data: null });
    }
  } catch (err) {
    console.log(err);
  }
});

const startBiding = asyncHandler(async (req, res) => {
  let currentDate = new Date();
  let countDownDate = currentDate.setMinutes(currentDate.getMinutes() + 1);
  let newDate = new Date(countDownDate).toString();

  const user = await User.findOne({ email: req.body.email });
  const bid = await biding.findById(req.params.id);
  const alreadyBid = await startBid.findOne({ bidId: bid._id });
  let data = await startBid.find({});
  if (alreadyBid) {
    req.body.dateTime = data[0].dateTime;
    const alreadyExist = await startBid.findOne({
      $and: [{ bidId: bid._id }, { userEmail: user.email }],
    });
    if (alreadyExist) {
      await startBid
        .updateOne(
          {
            _id: alreadyExist._id,
          },
          { $set: { bidPrice: req.body.bidPrice } }
        )
        .then((data) => {
          res.send({ status: 200, data: data });
        })
        .catch((err) => {
          console.log(err);
          res.send({ status: 400, msg: err });
        });
    } else {
      const data = await startBid.create({
        bidId: bid._id,
        userEmail: user.email,
        shareHolderName: req.body.shareHolderName,
        sharePercentage: req.body.sharePercentage,
        sharePrice: req.body.sharePrice,
        bidPrice: req.body.bidPrice,
      });
      res.send({ status: 200, data: data });
    }
  } else {
    const data = await startBid.create({
      bidId: bid._id,
      userEmail: user.email,
      shareHolderName: req.body.shareHolderName,
      sharePercentage: req.body.sharePercentage,
      sharePrice: req.body.sharePrice,
      bidPrice: req.body.bidPrice,
      dateTime: newDate,
    });
    res.send({ status: 200, data: data });
  }
});

const highestBid = asyncHandler(async (req, res) => {
  const highestBidPrices = await startBid.aggregate([
    {
      $group: {
        _id: "$bidId",
        highestBidPrice: { $max: "$bidPrice" },
      },
    },
    {
      $project: {
        _id: 1,
        highestBidPrice: 1,
      },
    },
  ]);

  res.status(200).send({ highestBidPrices });
});

const highestBidWinner = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const bidEndTimeList = await startBid.find({}, { dateTime: 1 }).exec();
  const hasBidEnded = bidEndTimeList.some(
    (item) => item.dateTime <= currentDate
  );
  if (hasBidEnded) {
    const highestBidPrices = await startBid.aggregate([
      {
        $group: {
          _id: "$bidId",
          highestBidPrice: { $max: "$bidPrice" },
          userEmail: { $last: "$userEmail" },
          sharePrice: { $first: "$sharePrice" },
          shareHolderName: { $first: "$shareHolderName" },
          dateTime: { $first: "$dateTime" },
        },
      },
      {
        $sort: {
          highestBidPrice: -1,
        },
      },
      {
        $project: {
          _id: 1,
          highestBidPrice: 1,
          userEmail: 1,
          sharePrice: 1,
          shareHolderName: 1,
          dateTime: 1,
        },
      },
    ]);
    const users = [];
    for (const item of highestBidPrices) {
      const user = await User.findOne({ email: item.userEmail });
      if (user) {
        users.push(user);
      }
    }
    res.status(200).send({ highestBidPrices, users });
  } else {
    res.status(200).send({
      message: `The bidding has not ended yet. minutes remaining.`,
    });
  }
});

const purchaseBid = asyncHandler(async (req, res) => {
  console.log("ok");
  const user = await User.findById(req.user._id);
  console.log(user);

  const releaseShareUser = await releaseShare.findOne({
    userEmail: user.email,
  });
  if (!releaseShareUser) {
    var otherModelData = new releaseShare({
      userEmail: user.email,
      userId: user._id,
      sharePercentage: 0,
    });
    await otherModelData.save();
  } else {
    const share = releaseShareUser.sharePercentage;
    const shareId = releaseShareUser._id;
    const startBidFound = await startBid.findOne({ id: req.params.id });
    const ShareHolderSharesId = startBidFound.bidId;
    const bidingFound = await biding.findOne({ id: ShareHolderSharesId });
    const bidId = bidingFound.bidId;
    const email = bidingFound.userEmail;
    const bidingSharePercentage = bidingFound.sharePercentage;

    const releaseShareHolder = await releaseShare.findOne({
      userEmail: email,
    });
    const ShareHolderShares = releaseShareHolder.sharePercentage;
    const shareHolderId = releaseShareHolder._id;

    const UpdateShares = await releaseShare.updateOne(
      { _id: shareId },
      { $set: { sharePercentage: share + ShareHolderShares } }
    );

    const update_shareholder_shares = await releaseShare.updateOne(
      { _id: shareHolderId },
      { $set: { sharePercentage: ShareHolderShares - bidingSharePercentage } }
    );

    const deleteBid = await biding.deleteOne({ bidId: bidId });
    const deleteStartedBid = await startBid.deleteMany({ bidid: bidId });

    res.send({
      data: otherModelData,
      UpdateShares: UpdateShares,
      update_shareholder_shares: update_shareholder_shares,
      deleteBid: deleteBid,
      deleteStartedBid: deleteStartedBid,
    });
  }
});

const deleteExpiredBids = asyncHandler(async (req, res) => {
  const highestBidPrices = await startBid.aggregate([
    {
      $group: {
        _id: "$bidId",
        highestBidPrice: { $max: "$bidPrice" },
        userEmail: { $last: "$userEmail" },
        sharePrice: { $first: "$sharePrice" },
        shareHolderName: { $first: "$shareHolderName" },
        dateTime: { $first: "$dateTime" },
      },
    },
    {
      $sort: {
        highestBidPrice: -1,
      },
    },
    {
      $project: {
        _id: 1,
        highestBidPrice: 1,
        userEmail: 1,
        sharePrice: 1,
        shareHolderName: 1,
        dateTime: 1,
      },
    },
  ]);
  const deleteBids = await startBid.deleteMany({
    bidId: highestBidPrices[0]._id,
  });

  res.json({ deleteBids: deleteBids });
});

export {
  bid,
  displayBid,
  startBiding,
  showBid,
  highestBid,
  highestBidWinner,
  purchaseBid,
  deleteExpiredBids,
};
