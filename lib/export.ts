import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDb } from './db';

export async function exportAllToJson(): Promise<string> {
  const db = await getDb();
  const rooms = await db.getAllAsync('SELECT * FROM rooms');
  const checkins = await db.getAllAsync('SELECT * FROM checkins');
  const settings = await db.getAllAsync('SELECT * FROM app_settings');

  const payload = { rooms, checkins, settings };
  const json = JSON.stringify(payload, null, 2);
  const fileUri = FileSystem.cacheDirectory + `clara-export-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(fileUri, json);
  return fileUri;
}

export async function shareFile(fileUri: string) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}


