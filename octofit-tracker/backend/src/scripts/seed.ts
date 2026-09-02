import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [northStars, trailBlazers] = await Team.create([
      {
        name: 'North Stars',
        description: 'A balanced team focused on consistent weekly movement.',
        members: [],
        weeklyGoal: 240,
      },
      {
        name: 'Trail Blazers',
        description: 'Outdoor enthusiasts who turn every workout into an adventure.',
        members: [],
        weeklyGoal: 300,
      },
    ]);

    const users = await User.create([
      { username: 'maya-chen', email: 'maya@example.com', displayName: 'Maya Chen', role: 'coach', team: northStars._id },
      { username: 'leo-martin', email: 'leo@example.com', displayName: 'Leo Martin', role: 'member', team: northStars._id },
      { username: 'sofia-patel', email: 'sofia@example.com', displayName: 'Sofia Patel', role: 'member', team: trailBlazers._id },
      { username: 'noah-williams', email: 'noah@example.com', displayName: 'Noah Williams', role: 'member', team: trailBlazers._id },
    ]);

    northStars.members = [users[0]._id, users[1]._id];
    trailBlazers.members = [users[2]._id, users[3]._id];
    await Promise.all([northStars.save(), trailBlazers.save()]);

    await Activity.create([
      { user: users[0]._id, type: 'strength', durationMinutes: 45, caloriesBurned: 280, completedAt: new Date('2026-08-29T07:30:00Z') },
      { user: users[1]._id, type: 'running', durationMinutes: 32, caloriesBurned: 360, completedAt: new Date('2026-08-30T08:00:00Z') },
      { user: users[2]._id, type: 'cycling', durationMinutes: 55, caloriesBurned: 510, completedAt: new Date('2026-08-30T17:30:00Z') },
      { user: users[3]._id, type: 'yoga', durationMinutes: 40, caloriesBurned: 170, completedAt: new Date('2026-08-31T09:00:00Z') },
    ]);

    await Leaderboard.create([
      { user: users[2]._id, team: trailBlazers._id, points: 920, rank: 1, period: '2026-W35' },
      { user: users[0]._id, team: northStars._id, points: 875, rank: 2, period: '2026-W35' },
      { user: users[1]._id, team: northStars._id, points: 740, rank: 3, period: '2026-W35' },
      { user: users[3]._id, team: trailBlazers._id, points: 680, rank: 4, period: '2026-W35' },
    ]);

    await Workout.create([
      {
        title: 'Quick Start Strength',
        description: 'A full-body session for building reliable movement habits.',
        category: 'strength', difficulty: 'beginner', durationMinutes: 25,
        exercises: ['Bodyweight squats', 'Incline push-ups', 'Glute bridges', 'Dead bugs'],
      },
      {
        title: 'Endurance Builder',
        description: 'A steady cardio workout that improves aerobic capacity.',
        category: 'cardio', difficulty: 'intermediate', durationMinutes: 35,
        exercises: ['Warm-up walk', 'Tempo run', 'Easy recovery', 'Cool-down stretch'],
      },
      {
        title: 'Reset and Restore',
        description: 'Gentle mobility work to help you recover and move freely.',
        category: 'mobility', difficulty: 'beginner', durationMinutes: 20,
        exercises: ['Cat-cow', 'Worlds greatest stretch', 'Hip flexor flow', 'Box breathing'],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
