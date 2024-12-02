import { openDB } from 'idb';

const DB_NAME = 'notesDB';
const STORE_NAME = 'notes';

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
  return db;
};

export const addNote = async (note: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, note);
};

export const getNotes = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteNote = async (id: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const updateNote = async (note: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, note);
};