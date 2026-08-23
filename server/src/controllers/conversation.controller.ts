import type {Request, Response} from "express"
import { conversationIdParamSchema } from "../validators/chat.validator.js";



export async function createConversation(req:Request, res:Response) {
        const {workspaceId} = conversationIdParamSchema.parse(req.params)

        
}