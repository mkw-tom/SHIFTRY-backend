import express from "express";
import { storeConnectLineGroupController } from "../controllers/store.controller";
import { verifyJWT } from "../middlewares/verify-JWT";

const router = express.Router();

router.put("/connect-lineGroup", verifyJWT, storeConnectLineGroupController);

export default router;
