import express from 'express';
import Match from '../models/Match';
import User from '../models/User';

const router = express.Router();

// Save Match Result
router.post('/result', async (req, res) => {
  try {
    const { wpm, accuracy, opponentId, winnerId, playerId } = req.body;
    if (!wpm || !accuracy || !opponentId || !winnerId || !playerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const match = await Match.create({
      player1: playerId,
      player2: opponentId,
      winner: winnerId,
      wpm,
      accuracy,
    });
    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // Sort by wins, then wpm
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'matches',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$winner', '$$userId'] } } },
          ],
          as: 'wins',
        },
      },
      {
        $addFields: {
          winCount: { $size: '$wins' },
        },
      },
      {
        $sort: { winCount: -1, wpm: -1 },
      },
      {
        $project: {
          username: 1,
          winCount: 1,
          wpm: 1,
        },
      },
    ]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
