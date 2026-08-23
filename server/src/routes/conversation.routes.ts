import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";


export const conversationRoutes = Router()

conversationRoutes.post("/", asyncHandler)