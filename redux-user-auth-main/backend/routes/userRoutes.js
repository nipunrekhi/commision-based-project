import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";
import * as orgController from "../controllers/orgController.js";
import * as sharesController from "../controllers/sharesController.js";
import * as bidingController from "../controllers/bidingController.js";

const router = express.Router();

//UserController
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.route("/profile").get(protect, userController.getUserProfile);
router.route("/usersList").get(protect, userController.getUsers);
router.route("/agentList/:ref_email").get(protect, userController.getAgents);
router
  .route("/userOfAgent/:ref_email")
  .get(protect, userController.getUserOfAgent);
router.get("/users/:id", userController.getUserById);
router.patch("/updateUser/:id", userController.updateUser);
router.get("/referenceList", userController.referenceList);
router.get("/details/:id", userController.details);

//OrganisationController
router.post("/comAgentReq/:id", orgController.commissionRequestAgent);
router.post("/comUserReq/:id", orgController.commissionRequestUser);
router.get("/requestApprove", protect, orgController.requestApprove);
router.post("/sendCom", protect, orgController.sendCommission);
router.post("/sendUserCom", protect, orgController.sendUserCommission);
router.get("/renew", protect, orgController.renew);
router.post("/reopenAccount", protect, orgController.reopenAccount);

//shareController
router.post("/shareInsert",protect,sharesController.shareInsert)
router.post("/buyShares/:id" ,protect, sharesController.buyShares);
router.get("/displayShare", sharesController.displayShares);

//bidingController
router.post("/bid", protect, bidingController.bid);
router.get("/displayBid", bidingController.displayBid);
router.post("/startBid/:id", bidingController.startBiding);
router.get("/showBid", bidingController.showBid);
router.get("/highestBid", bidingController.highestBid);
router.get("/highestBidWinner", bidingController.highestBidWinner);
router.post("/purchaseBid/:id",protect, bidingController.purchaseBid);
router.get("/deletExpiredBid", bidingController.deleteExpiredBids);






export default router;
