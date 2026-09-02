import express from 'express';
import { connectDatabase } from './config/database.js';
import { getApiBaseUrl } from './config/api.js';
import activitiesRouter from './routes/activities.js';
import leaderboardRouter from './routes/leaderboard.js';
import teamsRouter from './routes/teams.js';
import usersRouter from './routes/users.js';
import workoutsRouter from './routes/workouts.js';

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/config', (_request, response) => {
  response.json({ apiBaseUrl: getApiBaseUrl() });
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit API listening on port ${port}`);
    });
  } catch {
    process.exitCode = 1;
  }
}

void startServer();