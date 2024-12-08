class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};
  private keys: string[] = [];

  public length = 0;

  clear(): void {
    this.store = {};
    this.keys = [];
    this.length = 0;
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
    if (!this.keys.includes(key)) {
      this.keys.push(key);
      this.length = this.keys.length;
    }
  }

  removeItem(key: string): void {
    delete this.store[key];
    this.keys = this.keys.filter(k => k !== key);
    this.length = this.keys.length;
  }

  key(index: number): string | null {
    return this.keys[index] || null;
  }
}

const mockStorage = new LocalStorageMock();

Object.defineProperty(global, 'localStorage', {
  value: mockStorage
});

// If you need to access the mock instance in tests
export { mockStorage }; 