export interface StorageOptions {
  prefix?: string;
  serializer?: {
    stringify: <T>(value: T) => string;
    parse: <T>(value: string) => T;
  };
}

export class LocalStorage {
  private prefix: string;
  private serializer: Required<StorageOptions>['serializer'];

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || '';
    this.serializer = options.serializer || {
      stringify: <T>(value: T): string => JSON.stringify(value),
      parse: <T>(value: string): T => JSON.parse(value)
    };
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  set<T>(key: string, value: T): void {
    try {
      const serializedValue = this.serializer.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      throw new Error(`Failed to set item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = localStorage.getItem(this.getKey(key));
      if (value === null) return defaultValue;
      return this.serializer.parse<T>(value);
    } catch (error) {
      throw new Error(`Failed to get item: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(clearAll: boolean = false): void {
    if (clearAll) {
      localStorage.clear();
      return;
    }

    if (this.prefix) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix + ':')) {
          localStorage.removeItem(key);
        }
      }
    } else {
      localStorage.clear();
    }
  }

  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
}

export const storage = new LocalStorage();

export function createStorage(options: StorageOptions): LocalStorage {
  return new LocalStorage(options);
} 