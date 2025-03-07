import express from "express";
import { groupJoinController } from "../controllers/line.controller";

const router = express.Router();

router.post("/", groupJoinController);

export default router;
