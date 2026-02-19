
import Database from 'better-sqlite3';

const db = new Database('sqlite.db');

try {
  const motos = db.prepare('SELECT * FROM motorcycles').all();
  console.log('Motorcycles in DB:', motos);
} catch (error) {
  console.error('Error reading motorcycles:', error);
}

db.close();
