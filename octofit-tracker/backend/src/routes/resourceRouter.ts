import { Router } from 'express';
import type { Document, Model } from 'mongoose';
import { resourceModels, type ResourceName } from '../models/index.js';

export function createResourceRouter(resource: string): Router {
  const router = Router();
  const model = resourceModels[resource as ResourceName] as unknown as Model<Document> | undefined;

  router.get('/', async (_request, response) => {
    if (!model) {
      response.status(404).json({ error: `Unknown resource: ${resource}` });
      return;
    }

    try {
      const items = await model.find().sort({ createdAt: -1 }).lean();
      response.json({ resource, items });
    } catch (error) {
      console.error(`Error loading ${resource}:`, error);
      response.status(500).json({ error: `Unable to load ${resource}` });
    }
  });

  return router;
}