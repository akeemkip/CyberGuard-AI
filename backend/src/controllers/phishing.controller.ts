import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Get next scenario for user (prioritizes unseen, then failed)
export const getNextScenario = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get all active scenarios
    const activeScenarios = await prisma.phishingScenario.findMany({
      where: { isActive: true },
      select: { id: true }
    });

    if (activeScenarios.length === 0) {
      return res.status(404).json({ error: 'No scenarios available' });
    }

    // Get user's attempted scenario IDs
    const userAttempts = await prisma.phishingAttempt.findMany({
      where: { userId },
      select: { scenarioId: true, isCorrect: true }
    });

    const attemptedIds = new Set(userAttempts.map(a => a.scenarioId));
    const failedIds = new Set(
      userAttempts.filter(a => !a.isCorrect).map(a => a.scenarioId)
    );

    // Priority 1: Get unseen scenarios
    const unseenIds = activeScenarios
      .filter(s => !attemptedIds.has(s.id))
      .map(s => s.id);

    // Calculate progress
    const totalScenarios = activeScenarios.length;
    const completedScenarios = totalScenarios - unseenIds.length;
    const allCompleted = unseenIds.length === 0;

    let selectedScenarioId: string;

    if (unseenIds.length > 0) {
      // Return random unseen scenario
      selectedScenarioId = unseenIds[Math.floor(Math.random() * unseenIds.length)];
    } else if (failedIds.size > 0) {
      // Priority 2: Return random failed scenario
      const failedArray = Array.from(failedIds);
      selectedScenarioId = failedArray[Math.floor(Math.random() * failedArray.length)];
    } else {
      // All scenarios completed correctly - signal completion
      return res.json({
        scenario: null,
        progress: {
          completed: completedScenarios,
          total: totalScenarios,
          allCompleted: true,
          allCorrect: true
        }
      });
    }

    // Fetch full scenario data (without revealing isPhishing, redFlags, legitimateReason)
    const scenario = await prisma.phishingScenario.findUnique({
      where: { id: selectedScenarioId },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        senderName: true,
        senderEmail: true,
        subject: true,
        body: true,
        attachments: true
      }
    });

    res.json({
      scenario,
      progress: {
        completed: completedScenarios,
        total: totalScenarios,
        allCompleted,
        allCorrect: false
      }
    });
  } catch (error) {
    console.error('GetNextScenario error:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
};

// Submit attempt
export const submitAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { scenarioId, action, responseTimeMs } = req.body;

    // Validation
    if (!scenarioId || !action) {
      return res.status(400).json({ error: 'scenarioId and action are required' });
    }

    const validActions = ['REPORTED', 'MARKED_SAFE', 'CLICKED_LINK', 'DELETED', 'IGNORED'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Get scenario to determine correctness
    const scenario = await prisma.phishingScenario.findUnique({
      where: { id: scenarioId }
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // Determine if the user's action was correct
    // Correct actions:
    // - For phishing emails: REPORTED or DELETED
    // - For legitimate emails: MARKED_SAFE or IGNORED
    let isCorrect = false;
    if (scenario.isPhishing) {
      isCorrect = action === 'REPORTED' || action === 'DELETED';
    } else {
      isCorrect = action === 'MARKED_SAFE' || action === 'IGNORED';
    }

    // CLICKED_LINK is always wrong (even for legitimate emails, we want to train caution)
    if (action === 'CLICKED_LINK') {
      isCorrect = false;
    }

    // Create attempt record
    const attempt = await prisma.phishingAttempt.create({
      data: {
        userId,
        scenarioId,
        userAction: action,
        isCorrect,
        responseTimeMs: responseTimeMs || 0
      }
    });

    // Return result with explanation
    res.json({
      attemptId: attempt.id,
      isCorrect,
      wasPhishing: scenario.isPhishing,
      userAction: action,
      redFlags: scenario.isPhishing ? scenario.redFlags : [],
      legitimateReason: !scenario.isPhishing ? scenario.legitimateReason : null,
      explanation: isCorrect
        ? scenario.isPhishing
          ? 'Correct! This was a phishing email. You identified it correctly.'
          : 'Correct! This was a legitimate email.'
        : scenario.isPhishing
          ? 'Incorrect. This was a phishing email. Look for the red flags listed below.'
          : 'Incorrect. This was actually a legitimate email.'
    });
  } catch (error) {
    console.error('SubmitAttempt error:', error);
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
};

// Get user's phishing stats
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get all user attempts
    const attempts = await prisma.phishingAttempt.findMany({
      where: { userId },
      include: {
        scenario: {
          select: { difficulty: true, isPhishing: true }
        }
      }
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const accuracy = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

    // Calculate click rate (clicking links on phishing emails)
    const phishingAttempts = attempts.filter(a => a.scenario.isPhishing);
    const clickedLinks = phishingAttempts.filter(a => a.userAction === 'CLICKED_LINK').length;
    const clickRate = phishingAttempts.length > 0
      ? Math.round((clickedLinks / phishingAttempts.length) * 100)
      : 0;

    // Calculate report rate (correctly reporting phishing emails)
    const reportedPhishing = phishingAttempts.filter(a => a.userAction === 'REPORTED').length;
    const reportRate = phishingAttempts.length > 0
      ? Math.round((reportedPhishing / phishingAttempts.length) * 100)
      : 0;

    // Stats by difficulty
    const byDifficulty = {
      Beginner: { total: 0, correct: 0 },
      Intermediate: { total: 0, correct: 0 },
      Advanced: { total: 0, correct: 0 }
    };

    attempts.forEach(a => {
      const diff = a.scenario.difficulty as keyof typeof byDifficulty;
      if (byDifficulty[diff]) {
        byDifficulty[diff].total++;
        if (a.isCorrect) byDifficulty[diff].correct++;
      }
    });

    // Calculate current streak
    const sortedAttempts = [...attempts].sort(
      (a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
    );

    let streak = 0;
    for (const attempt of sortedAttempts) {
      if (attempt.isCorrect) {
        streak++;
      } else {
        break;
      }
    }

    // Average response time
    const avgResponseTime = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.responseTimeMs, 0) / totalAttempts)
      : 0;

    res.json({
      totalAttempts,
      correctAttempts,
      accuracy,
      clickRate,
      reportRate,
      streak,
      avgResponseTimeMs: avgResponseTime,
      byDifficulty: Object.entries(byDifficulty).map(([difficulty, data]) => ({
        difficulty,
        total: data.total,
        correct: data.correct,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
      }))
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Get user's attempt history
export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const [attempts, total] = await Promise.all([
      prisma.phishingAttempt.findMany({
        where: { userId },
        include: {
          scenario: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              category: true,
              senderName: true,
              senderEmail: true,
              subject: true,
              isPhishing: true
            }
          }
        },
        orderBy: { attemptedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.phishingAttempt.count({ where: { userId } })
    ]);

    res.json({
      attempts: attempts.map(a => ({
        id: a.id,
        scenarioId: a.scenarioId,
        scenarioTitle: a.scenario.title,
        difficulty: a.scenario.difficulty,
        category: a.scenario.category,
        senderName: a.scenario.senderName,
        senderEmail: a.scenario.senderEmail,
        subject: a.scenario.subject,
        wasPhishing: a.scenario.isPhishing,
        userAction: a.userAction,
        isCorrect: a.isCorrect,
        responseTimeMs: a.responseTimeMs,
        attemptedAt: a.attemptedAt
      })),
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('GetHistory error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
