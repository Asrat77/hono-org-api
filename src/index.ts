import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import positionRouter from './routes/position';
import { db } from './db';
import { positions } from './models/position';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const router = new Hono();
router.get('/', async (c) => {
  const allPositions = await db.select().from(positions);
  return c.json(allPositions);
});

app.route('/positions', router);
app.route('/positions', positionRouter);

const port = 3000;
console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;