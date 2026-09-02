import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  displayName: string;
  role: 'member' | 'coach';
  team?: mongoose.Types.ObjectId;
}

export interface TeamDocument extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  weeklyGoal: number;
}

export interface ActivityDocument extends Document {
  user: mongoose.Types.ObjectId;
  type: 'running' | 'cycling' | 'strength' | 'yoga';
  durationMinutes: number;
  caloriesBurned: number;
  completedAt: Date;
}

export interface LeaderboardDocument extends Document {
  user: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  points: number;
  rank: number;
  period: string;
}

export interface WorkoutDocument extends Document {
  title: string;
  description: string;
  category: 'strength' | 'cardio' | 'mobility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  exercises: string[];
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  displayName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['member', 'coach'], default: 'member' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

const teamSchema = new Schema<TeamDocument>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  weeklyGoal: { type: Number, required: true, min: 0 },
}, { timestamps: true });

const activitySchema = new Schema<ActivityDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['running', 'cycling', 'strength', 'yoga'], required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  caloriesBurned: { type: Number, required: true, min: 0 },
  completedAt: { type: Date, required: true },
}, { timestamps: true });

const leaderboardSchema = new Schema<LeaderboardDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  points: { type: Number, required: true, min: 0 },
  rank: { type: Number, required: true, min: 1 },
  period: { type: String, required: true },
}, { timestamps: true });

const workoutSchema = new Schema<WorkoutDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['strength', 'cardio', 'mobility'], required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  exercises: { type: [String], required: true },
}, { timestamps: true });

export const User = (mongoose.models.User as Model<UserDocument>) || mongoose.model<UserDocument>('User', userSchema);
export const Team = (mongoose.models.Team as Model<TeamDocument>) || mongoose.model<TeamDocument>('Team', teamSchema);
export const Activity = (mongoose.models.Activity as Model<ActivityDocument>) || mongoose.model<ActivityDocument>('Activity', activitySchema);
export const Leaderboard = (mongoose.models.Leaderboard as Model<LeaderboardDocument>) || mongoose.model<LeaderboardDocument>('Leaderboard', leaderboardSchema);
export const Workout = (mongoose.models.Workout as Model<WorkoutDocument>) || mongoose.model<WorkoutDocument>('Workout', workoutSchema);

export const resourceModels = { users: User, teams: Team, activities: Activity, leaderboard: Leaderboard, workouts: Workout } as const;
export type ResourceName = keyof typeof resourceModels;
