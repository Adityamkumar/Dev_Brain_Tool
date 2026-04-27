import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Note } from "../models/note.model";
import { ApiResponse } from "../utils/ApiResponse";

export const createNote = asyncHandler(async (req:any, res: Response)=>{
   const { content, type, sourceUrl, tags } = req.body

   const note = await Note.create({
      userId: req.user?._id || "64f123abc123abc123abc123",
      content: content,
      type: type,
      tags: tags || [],
      sourceUrl: sourceUrl
   })

   res 
   .status(200)
   .json(new ApiResponse(200, note, "Note created successfully"))
})

export const searchNote = asyncHandler(async(req: any, res: Response)=>{
    const { query } = req.query

  
const userId = req.user?.id || "64f123abc123abc123abc123";

// 1. Text search
const textResults = await Note.find({
  userId,
  $text: { $search: query }
});

// 2. Regex search
const regexResults = await Note.find({
  userId,
  content: { $regex: query, $options: "i" }
});

// 3. Merge + remove duplicates
const combined = [...textResults, ...regexResults];

const uniqueResults = Array.from(
  new Map(combined.map(item => [item._id.toString(), item])).values()
);

   res
   .status(200)
   .json(new ApiResponse(200, uniqueResults, "notes fetched")) 
})

export const getAllNotes = asyncHandler(async(req: any, res: Response)=>{
    const notes = await Note.find({
      userId: req.user?.id || "64f123abc123abc123abc123"
    }).sort({ createdAt: -1 });

res
.status(200)
.json(new ApiResponse(200, notes, "all notes"))
})