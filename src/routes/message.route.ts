import express from "express";
import { groupJoinController } from "../controllers/messege.controller";

const router = express.Router();

router.post("/", groupJoinController);

export default router;
