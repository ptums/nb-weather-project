export class IndexedDBTable<T> {
  private readonly dbName: string = "NBWeatherDB";
  private version: number = 2;
  private db: IDBDatabase | null = null;

  constructor(private tableName: string) {}

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        if (!this.db.objectStoreNames.contains(this.tableName)) {
          this.db.close();
          this.version += 1;
          this.openDB().then(resolve).catch(reject);
        } else {
          resolve(this.db);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.tableName)) {
          db.createObjectStore(this.tableName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };
    });
  }

  async getAll(): Promise<T[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.tableName, "readonly");
      const store = transaction.objectStore(this.tableName);
      const request = store.getAll();

      request.onerror = (event) => {
        console.error(`Error getting all items:`, event);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log(`Successfully retrieved ${request.result.length} items`);
        resolve(request.result);
      };
    });
  }

  async set(value: T): Promise<number> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.tableName, "readwrite");
      const store = transaction.objectStore(this.tableName);
      const request = store.add(value);

      request.onerror = (event) => {
        console.error(`Error setting item:`, event);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log(`Item set successfully`);
        resolve(request.result as number);
      };
    });
  }

  async update(id: number, value: Partial<T>): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.tableName, "readwrite");
      const store = transaction.objectStore(this.tableName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = { ...request.result, ...value };
        const updateRequest = store.put(data);
        updateRequest.onerror = () => reject(updateRequest.error);
        updateRequest.onsuccess = () => resolve();
      };
    });
  }

  async delete(id: number): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.tableName, "readwrite");
      const store = transaction.objectStore(this.tableName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}
