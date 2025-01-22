import * as SQLite from 'expo-sqlite';

export const getConnection = async () => {
    const connection = await SQLite.openDatabaseAsync('databaseUsuarios');
    return connection;
  };