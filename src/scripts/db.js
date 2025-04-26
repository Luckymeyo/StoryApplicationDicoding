const DB_NAME = 'story-app';
const DB_VERSION = 1;
const STORE_STORIES = 'stories';
const STORE_OUTBOX = 'outbox';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_STORIES)) {
        db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        db.createObjectStore(STORE_OUTBOX, { autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveStoriesToIDB(stories) {
  const db = await openDB();
  const tx = db.transaction(STORE_STORIES, 'readwrite');
  const store = tx.objectStore(STORE_STORIES);

  stories.forEach(s => {
    if (s.id) {
      store.put(s);
    } else {
      console.warn('Story without id skipped:', s);
    }
  });

  return tx.complete;
}

export async function getStoriesFromIDB() {
  const db = await openDB();
  const tx = db.transaction(STORE_STORIES, 'readonly');
  const store = tx.objectStore(STORE_STORIES);
  return store.getAll();
}

export async function saveOutboxItem(item) {
  const db = await openDB();
  const tx = db.transaction(STORE_OUTBOX, 'readwrite');
  tx.objectStore(STORE_OUTBOX).add(item);
  return tx.complete;
}

export async function getOutboxItems() {
  const db = await openDB();
  const tx = db.transaction(STORE_OUTBOX, 'readonly');
  return tx.objectStore(STORE_OUTBOX).getAll();
}

export async function clearOutbox() {
  const db = await openDB();
  const tx = db.transaction(STORE_OUTBOX, 'readwrite');
  tx.objectStore(STORE_OUTBOX).clear();
  return tx.complete;
}
