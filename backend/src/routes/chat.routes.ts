import { Router, Request, Response } from 'express';
import { llmService } from '../services/llm.service.js';
import { sessionService } from '../services/session.service.js';
import { validateChatMessage, validateSessionId } from '../middleware/validation.middleware.js';
import { ApologyStyle } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and get an apology response
 */
router.post('/message', validateChatMessage, async (req: Request, res: Response) => {
  try {
    const { message, style, sessionId: clientSessionId } = req.body;

    // Use provided session ID or create a new one
    const sessionId = clientSessionId || uuidv4();

    // Get conversation history
    const history = sessionService.getMessages(sessionId);

    // Generate apology response
    const response = await llmService.generateApology({
      message,
      style: style as ApologyStyle,
      history: history.slice(-10), // Only use last 10 messages for context
    });

    // Save user message and assistant response to session
    sessionService.addMessage(sessionId, {
      role: 'user',
      content: message,
    });

    sessionService.addMessage(sessionId, {
      role: 'assistant',
      content: response.reply,
    });

    // Return response
    res.json({
      sessionId,
      reply: response.reply,
      emotion: response.emotion,
      style: response.style,
      tokensUsed: response.tokensUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error will be handled by error middleware
    throw error;
  }
});

/**
 * GET /api/chat/history
 * Get conversation history for a session
 */
router.get('/history', validateSessionId, async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId as string;

    // Get messages for session
    const messages = sessionService.getMessages(sessionId);

    // Get session info
    const sessionInfo = sessionService.getSessionInfo(sessionId);

    res.json({
      sessionId,
      messages,
      messageCount: messages.length,
      createdAt: sessionInfo?.createdAt,
      updatedAt: sessionInfo?.updatedAt,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * DELETE /api/chat/history
 * Clear conversation history for a session
 */
router.delete('/history', validateSessionId, async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId as string || req.body.sessionId;

    // Clear session
    sessionService.clearSession(sessionId);

    res.json({
      sessionId,
      message: 'History cleared successfully',
    });
  } catch (error) {
    throw error;
  }
});

/**
 * DELETE /api/chat/session
 * Delete a session entirely
 */
router.delete('/session', validateSessionId, async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId as string || req.body.sessionId;

    // Delete session
    const deleted = sessionService.deleteSession(sessionId);

    if (deleted) {
      res.json({
        sessionId,
        message: 'Session deleted successfully',
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
    }
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/chat/sessions
 * Get all session IDs (for debugging)
 */
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const sessionIds = sessionService.getAllSessionIds();

    res.json({
      sessions: sessionIds,
      count: sessionIds.length,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
