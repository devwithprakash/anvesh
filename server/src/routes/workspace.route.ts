import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import { requireAuth } from "../middleware/require-auth-middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listWorkspaces));
router.post("/", asyncHandler(createWorkspace));
router.get("/:workspaceId", asyncHandler(getWorkspace));
router.patch("/:workspaceId", asyncHandler(updateWorkspace));
router.delete("/:workspaceId", asyncHandler(deleteWorkspace));

export default router
