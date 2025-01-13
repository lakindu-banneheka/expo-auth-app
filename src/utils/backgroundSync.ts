// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';
// import { storage, STORAGE_KEYS } from './storageUtils';
// import { checkConnectivity } from './networkUtils';

// const BACKGROUND_SYNC_TASK = 'background-sync';

// TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
//   try {
//     const isConnected = await checkConnectivity();
//     if (!isConnected) {
//       return BackgroundFetch.Result.NoData;
//     }

//     const syncResult = await performSync();
//     return syncResult 
//       ? BackgroundFetch.Result.NewData
//       : BackgroundFetch.Result.NoData;
//   } catch (error) {
//     console.error('Background sync error:', error);
//     return BackgroundFetch.Result.Failed;
//   }
// });

// export async function registerBackgroundSync() {
//   try {
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
//       minimumInterval: 15 * 60, // 15 minutes
//       stopOnTerminate: false,
//       startOnBoot: true,
//     });
//     console.log('Background sync registered');
//   } catch (error) {
//     console.error('Background sync registration failed:', error);
//   }
// }

// async function performSync(): Promise<boolean> {
//   const db = getFirestore();
//   let hasChanges = false;

//   try {
//     const userId = await storage.get(STORAGE_KEYS.USER_ID);
//     if (!userId) return false;

//     const queue = await storage.get(STORAGE_KEYS.OFFLINE_QUEUE) || [];
//     if (!queue.length) return false;

//     for (const item of queue) {
//       switch (item.type) {
//         case 'UPDATE_PROFILE':
//           await setDoc(
//             doc(db, 'users', userId),
//             item.data,
//             { merge: true }
//           );
//           hasChanges = true;
//           break;
//       }
//     }

//     if (hasChanges) {
//       await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, []);
      
//       const timestamp = new Date().toISOString();
//       await storage.set(STORAGE_KEYS.LAST_SYNC, timestamp);
      
//       await setDoc(
//         doc(db, 'users', userId),
//         { lastSyncedAt: timestamp },
//         { merge: true }
//       );
//     }

//     return hasChanges;
//   } catch (error) {
//     console.error('Sync error:', error);
//     return false;
//   }
// }

// export async function addToOfflineQueue(action: { type: string; data: any }) {
//   try {
//     const queue = await storage.get(STORAGE_KEYS.OFFLINE_QUEUE) || [];
//     queue.push({
//       ...action,
//       timestamp: new Date().toISOString(),
//     });
//     await storage.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
//   } catch (error) {
//     console.error('Error adding to offline queue:', error);
//   }
// }

// export async function getLastSyncTime(): Promise<string | null> {
//   return storage.get(STORAGE_KEYS.LAST_SYNC);
// }

// export async function forceSyncNow(): Promise<boolean> {
//   return performSync();
// }