export const DB_NAME = 'peakride_db';
export const DB_VERSION = 1;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('bookings')) {
        const bookingStore = db.createObjectStore('bookings', { keyPath: 'id' });
        bookingStore.createIndex('status', 'status', { unique: false });
        bookingStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('vehicles')) {
        db.createObjectStore('vehicles', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('offline_requests')) {
        const requestStore = db.createObjectStore('offline_requests', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        requestStore.createIndex('timestamp', 'timestamp', { unique: false });
        requestStore.createIndex('processed', 'processed', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('maps')) {
        db.createObjectStore('maps', { keyPath: 'id' });
      }
    };
  });
};

export const saveToStore = async <T>(
  storeName: string, 
  data: T
): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save data'));
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw error;
  }
};

export const getFromStore = async <T>(
  storeName: string, 
  key: string | number
): Promise<T | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve data'));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error retrieving from IndexedDB:', error);
    throw error;
  }
};

export const getAllFromStore = async <T>(
  storeName: string,
  indexName?: string,
  range?: IDBKeyRange
): Promise<T[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request: IDBRequest;
      if (indexName) {
        const index = store.index(indexName);
        request = range ? index.getAll(range) : index.getAll();
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(new Error('Failed to retrieve data'));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error retrieving all from IndexedDB:', error);
    throw error;
  }
};

export const deleteFromStore = async (
  storeName: string, 
  key: string | number
): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete data'));
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Error deleting from IndexedDB:', error);
    throw error;
  }
};

export const queueOfflineRequest = async (
  url: string, 
  method: string, 
  data: any
): Promise<void> => {
  try {
    const offlineRequest = {
      url,
      method,
      data,
      timestamp: new Date().getTime(),
      processed: false
    };
    
    await saveToStore('offline_requests', offlineRequest);
  } catch (error) {
    console.error('Error queueing offline request:', error);
    throw error;
  }
};

export const processOfflineQueue = async (): Promise<void> => {
  try {
    if (!navigator.onLine) return;
    
    const requests = await getAllFromStore<{
      id?: number;
      url: string;
      method: string;
      data: any;
      processed: boolean;
    }>('offline_requests');
    
    const unprocessedRequests = requests.filter(req => !req.processed);
    
    for (const request of unprocessedRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request.data)
        });
        
        // Mark as processed
        if (request.id) {
          const processedRequest = { ...request, processed: true };
          await saveToStore('offline_requests', processedRequest);
        }
      } catch (error) {
        console.error('Failed to process offline request:', error);
      }
    }
    
    // Clean up processed requests older than 24 hours
    const oldRequests = requests.filter(req => {
      const requestAge = Date.now() - req.timestamp;
      return req.processed && requestAge > 24 * 60 * 60 * 1000;
    });
    
    for (const request of oldRequests) {
      if (request.id) {
        await deleteFromStore('offline_requests', request.id);
      }
    }
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
};