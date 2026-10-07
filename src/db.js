// ─────────────────────────────────────────────────────────────
//  Conexión a SQLite — YA FUNCIONA (abre/crea el archivo de DB).
//  Lo que te toca a ti: DISEÑAR el esquema de los datos.
// ─────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH || './db/app.sqlite';

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`);

export default db;
