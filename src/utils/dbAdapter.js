/**
 * Adapter de banco para iOS/Android — usa expo-sqlite.
 */
import * as SQLite from 'expo-sqlite';

let _db = null;

export function getDB() {
  if (!_db) _db = SQLite.openDatabaseSync('japaoquest.db');
  return _db;
}
