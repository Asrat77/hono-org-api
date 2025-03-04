import { Context } from 'hono';
import { db } from '../db';
import { positions } from '../models/position';
import { eq } from 'drizzle-orm';

export async function createPosition(c: Context) {
  const body = await c.req.json();
  const { name, description, parentId } = body;

  if (!name || !description || (!parentId && name !== 'CEO')) {
    return c.json({ error: 'Name, description, and parentId (except for CEO) are required' }, 400);
  }

  const [newPosition] = await db
    .insert(positions)
    .values({ name, description, parentId })
    .returning();

  return c.json(newPosition, 201);
}

export async function updatePosition(c: Context) {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { name, description, parentId } = body;

  const [updatedPosition] = await db
    .update(positions)
    .set({ name, description, parentId })
    .where(eq(positions.id, id))
    .returning();

  if (!updatedPosition) return c.json({ error: 'Position not found' }, 404);
  return c.json(updatedPosition);
}

export async function getPosition(c: Context) {
  const id = c.req.param('id');
  const [position] = await db.select().from(positions).where(eq(positions.id, id));
  if (!position) return c.json({ error: 'Position not found' }, 404);
  return c.json(position);
}

export async function getHierarchy(c: Context) {
  const allPositions = await db.select().from(positions);
  const hierarchy = buildTree(allPositions);
  return c.json(hierarchy);
}

export async function getChildren(c: Context) {
  const id = c.req.param('id');
  const children = await db
    .select()
    .from(positions)
    .where(eq(positions.parentId, id));
  return c.json(children);
}

export async function deletePosition(c: Context) {
  const id = c.req.param('id');
  const [deleted] = await db
    .delete(positions)
    .where(eq(positions.id, id))
    .returning();
  if (!deleted) return c.json({ error: 'Position not found' }, 404);
  return c.json({ message: 'Position deleted' });
}

function buildTree(positionsList: typeof positions.$inferSelect[]) {
  const map = new Map();
  const roots: any[] = [];

  positionsList.forEach((pos) => map.set(pos.id, { ...pos, children: [] }));

  positionsList.forEach((pos) => {
    if (!pos.parentId) {
      roots.push(map.get(pos.id));
    } else {
      const parent = map.get(pos.parentId);
      if (parent) parent.children.push(map.get(pos.id));
    }
  });

  return roots;
}