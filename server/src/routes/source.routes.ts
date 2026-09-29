import { Router } from 'express';

import {
  bulkDeleteSources,
  createSource,
  deleteSource,
  getSource,
  importWebsite,
  importYoutube,
  listSources,
  uploadFile,
} from '../controllers/source.controller.js';
import { uploadSingleFile } from '../middleware/upload-middleware.js';
import { asyncHandler } from '../utils/async-handler.js';

export const sourceRoutes = Router({ mergeParams: true });

sourceRoutes.post('/upload', uploadSingleFile, asyncHandler(uploadFile));

sourceRoutes.post('/import/website', asyncHandler(importWebsite));
sourceRoutes.post('/import/youtube', asyncHandler(importYoutube));
sourceRoutes.get('/', asyncHandler(listSources));
sourceRoutes.post('/', asyncHandler(createSource));
sourceRoutes.post('/bulk-delete', asyncHandler(bulkDeleteSources));
sourceRoutes.get('/:sourceId', asyncHandler(getSource));
sourceRoutes.delete('/:sourceId', asyncHandler(deleteSource));
