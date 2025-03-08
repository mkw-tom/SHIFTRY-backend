import express from "express";
import { groupJoinController } from "../controllers/lineMessege.controller";

const router = express.Router();

router.post("/", groupJoinController);

export default router;
