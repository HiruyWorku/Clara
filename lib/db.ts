import * as SQLite from 'expo-sqlite';

export type Room = {
  id: string;
  name: string;
  emoji?: string | null;
  created_at: string;
  archived?: number;
  sort_order?: number;
};

export type Checkin = {
  id: string;
  room_id: string;
  date: string; // YYYY-MM-DD
  is_tidy: number; // 1 or 0
  reason?: string | null;
  created_at: string;
};

export type AppSettings = {
  id: number;
  notify_hour: number | null;
  notify_min: number | null;
  voice_enabled: number; // 1/0
  stt_enabled: number; // 1/0
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    console.log('🗄️ Opening database...');
    dbPromise = SQLite.openDatabaseAsync('clara.db').then(async (db) => {
      console.log('🔄 Running migrations...');
      await migrate(db);
      console.log('✅ Database ready');
      return db;
    });
  }
  return dbPromise;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS rooms(
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT,
        created_at TEXT NOT NULL,
        archived INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS checkins(
        id TEXT PRIMARY KEY NOT NULL,
        room_id TEXT NOT NULL,
        date TEXT NOT NULL,
        is_tidy INTEGER NOT NULL,
        reason TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(room_id) REFERENCES rooms(id)
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS app_settings(
        id INTEGER PRIMARY KEY NOT NULL,
        notify_hour INTEGER,
        notify_min INTEGER,
        voice_enabled INTEGER DEFAULT 1,
        stt_enabled INTEGER DEFAULT 1
      );`
    );

    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_checkins_room_date ON checkins(room_id, date);`
    );

    const res = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM app_settings'
    );
    if (!res || (res as any).count === 0) {
      await db.runAsync(
        'INSERT INTO app_settings (id, notify_hour, notify_min, voice_enabled, stt_enabled) VALUES (1, 20, 0, 1, 1)'
      );
    }
  });
}

export async function getRooms(): Promise<Room[]> {
  const db = await getDb();
  return db.getAllAsync<Room>('SELECT * FROM rooms WHERE archived = 0 ORDER BY sort_order ASC, created_at ASC');
}

export async function createRoom(room: Pick<Room, 'id' | 'name' | 'emoji' | 'created_at'> & { sort_order?: number }): Promise<void> {
  console.log('💾 Creating room in DB:', room);
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO rooms (id, name, emoji, created_at, sort_order) VALUES (?, ?, ?, ?, ?)',
    [room.id, room.name, room.emoji ?? null, room.created_at, room.sort_order ?? 0]
  );
  console.log('✅ Room inserted into database');
}

export async function updateRoomName(roomId: string, name: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE rooms SET name = ? WHERE id = ?', [name, roomId]);
}

export async function archiveRoom(roomId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE rooms SET archived = 1 WHERE id = ?', [roomId]);
}

export async function reorderRooms(order: { roomId: string; sort_order: number }[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const item of order) {
      await db.runAsync('UPDATE rooms SET sort_order = ? WHERE id = ?', [item.sort_order, item.roomId]);
    }
  });
}

export async function getCheckinsByRoom(roomId: string, from?: string, to?: string): Promise<Checkin[]> {
  const db = await getDb();
  if (from && to) {
    return db.getAllAsync<Checkin>(
      'SELECT * FROM checkins WHERE room_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
      [roomId, from, to]
    );
  }
  return db.getAllAsync<Checkin>(
    'SELECT * FROM checkins WHERE room_id = ? ORDER BY date DESC',
    [roomId]
  );
}

export async function getAllCheckins(): Promise<Checkin[]> {
  const db = await getDb();
  return db.getAllAsync<Checkin>('SELECT * FROM checkins ORDER BY date DESC');
}

export async function getLatestCheckinByRoom(roomId: string): Promise<Checkin | null> {
  const db = await getDb();
  return db.getFirstAsync<Checkin>(
    'SELECT * FROM checkins WHERE room_id = ? ORDER BY date DESC LIMIT 1',
    [roomId]
  );
}

export async function createCheckin(payload: {
  id: string;
  roomId: string;
  date: string;
  isTidy: boolean;
  reason?: string | null;
  createdAt: string;
}): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO checkins (id, room_id, date, is_tidy, reason, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [payload.id, payload.roomId, payload.date, payload.isTidy ? 1 : 0, payload.reason ?? null, payload.createdAt]
  );
}

export async function getSettings(): Promise<AppSettings | null> {
  const db = await getDb();
  return db.getFirstAsync<AppSettings>('SELECT * FROM app_settings WHERE id = 1');
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  const db = await getDb();
  const current = await getSettings();
  const merged = { ...current, ...settings } as AppSettings;
  await db.runAsync(
    'UPDATE app_settings SET notify_hour = ?, notify_min = ?, voice_enabled = ?, stt_enabled = ? WHERE id = 1',
    [merged.notify_hour, merged.notify_min, merged.voice_enabled, merged.stt_enabled]
  );
}


