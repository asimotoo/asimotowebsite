
import Database from 'better-sqlite3';

const db = new Database('sqlite.db');

console.log('Creating motorcycles table...');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS motorcycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      price INTEGER NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      listing_date INTEGER,
      type TEXT NOT NULL,
      year INTEGER NOT NULL,
      km INTEGER NOT NULL,
      engine_volume TEXT NOT NULL,
      color TEXT NOT NULL,
      heavy_damage INTEGER DEFAULT 0,
      description TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER
    );
  `);
  console.log('Table motorcycles created successfully.');
  
  // Verify it exists
  const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='motorcycles'").get();
  console.log('Verification:', table);

} catch (error) {
  console.error('Error creating table:', error);
}

db.close();
