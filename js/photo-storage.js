/* Shared photo persistence for the camera and compositor. */
(function createPhotoStorage(global) {
  const databaseName = "some-memory-lane";
  const storeName = "photo-sessions";
  const mediaStoreName = "session-media";
  const version = 2;

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        reject(new Error("IndexedDB is unavailable in this browser."));
        return;
      }

      const request = global.indexedDB.open(databaseName, version);

      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(storeName)) {
          request.result.createObjectStore(storeName);
        }
        if (!request.result.objectStoreNames.contains(mediaStoreName)) {
          request.result.createObjectStore(mediaStoreName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error || new Error("Could not open photo storage."));
    });
  }

  async function read(sessionId) {
    if (!sessionId) {
      return [];
    }

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database
        .transaction(storeName, "readonly")
        .objectStore(storeName)
        .get(sessionId);
      request.onsuccess = () =>
        resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () =>
        reject(request.error || new Error("Could not read photo storage."));
    });
  }

  async function write(sessionId, photos) {
    if (!sessionId) {
      throw new Error("A session ID is required to save photos.");
    }

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database
        .transaction(storeName, "readwrite")
        .objectStore(storeName)
        .put(photos, sessionId);
      request.onsuccess = () => resolve(true);
      request.onerror = () =>
        reject(request.error || new Error("Could not save photo storage."));
    });
  }

  async function remove(sessionId) {
    if (!sessionId) {
      return;
    }

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database
        .transaction(storeName, "readwrite")
        .objectStore(storeName)
        .delete(sessionId);
      request.onsuccess = () => resolve(true);
      request.onerror = () =>
        reject(request.error || new Error("Could not clear photo storage."));
    });
  }

  async function migrate(sessionId) {
    const legacy = JSON.parse(
      global.localStorage.getItem("memoryLanePhotos") || "[]",
    );

    if (!Array.isArray(legacy) || !legacy.length || !sessionId) {
      return [];
    }

    await write(sessionId, legacy);
    global.localStorage.removeItem("memoryLanePhotos");
    return legacy;
  }

  async function writeMedia(sessionId, media) {
    if (!sessionId) throw new Error("A session ID is required to save media.");
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(mediaStoreName, "readwrite")
        .objectStore(mediaStoreName).put(media, sessionId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error || new Error("Could not save session media."));
    });
  }

  async function readMedia(sessionId) {
    if (!sessionId) return null;
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(mediaStoreName, "readonly")
        .objectStore(mediaStoreName).get(sessionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Could not read session media."));
    });
  }

  async function removeMedia(sessionId) {
    if (!sessionId) return;
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(mediaStoreName, "readwrite")
        .objectStore(mediaStoreName).delete(sessionId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error || new Error("Could not clear session media."));
    });
  }

  global.MemoryLanePhotoStorage = Object.freeze({
    read,
    write,
    remove,
    migrate,
    writeMedia,
    readMedia,
    removeMedia,
  });
})(window);
