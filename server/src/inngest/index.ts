import { inngest } from './client.js';
import { findChunksBySourceId } from '../repositories/source-chunk.repository.js';
import { findSourceById } from '../repositories/source.repository.js';
import { summarizeConversationById } from '../services/conversation-memory.service.js';
import {
  chunkSourceContent,
  embedAndIndexSource,
  extractSourceContent,
  markSourceFailed,
  markSourceProcessing,
} from '../services/source-processing.service.js';
import logger from '../utils/logger.js';

export const processSource = inngest.createFunction(
  {
    id: 'process-source',
    retries: 3,
    triggers: [{ event: 'source/created' }],
  },
  async ({ event, step }) => {
    const sourceId = event.data.sourceId as string;

    logger.info('Source processing started', {
      sourceId,
    });

    await step.run('mark-processing', () => markSourceProcessing(sourceId));

    try {
      // extract the text content
      const extracted = await step.run('extract-content', () =>
        extractSourceContent(sourceId),
      );

      // store chunks in database
      await step.run('chunk-content', () =>
        chunkSourceContent(sourceId, extracted.text, extracted.pages),
      );

      const result = await step.run('embed-and-index', async () => {
        const source = await findSourceById(sourceId);

        if (!source) {
          throw new Error('Source not found');
        }

        const chunks = await findChunksBySourceId(sourceId);
        await embedAndIndexSource(source, chunks);

        return { chunkCount: chunks.length };
      });

      logger.info('Source processing completed', {
        sourceId,
        chunkCount: result.chunkCount,
      });

      return { sourceId, status: 'READY', ...result };
    } catch (error) {
      logger.error('Source processing failed', {
        sourceId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      await step.run('mark-failed', async () => {
        const source = await findSourceById(sourceId);
        if (source) {
          await markSourceFailed(sourceId, error, source.metadata);
        }
      });

      throw error;
    }
  },
);

export const summarizeConversation = inngest.createFunction(
  {
    id: 'summarize-conversation',
    retries: 2,
    triggers: [{ event: 'conversation/summarize' }],
  },
  async ({ event, step }) => {
    const conversationId = event.data.conversationId as string;

    await step.run('summarize', () => {
      summarizeConversationById(conversationId);
    });

    return { conversationId, status: 'SUMMARIZE' };
  },
);

export const functions = [processSource];
