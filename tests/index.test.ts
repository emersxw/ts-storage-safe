import { LocalStorage, createStorage } from '../src';

describe('LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve values', () => {
    const storage = new LocalStorage();
    const testData = { name: 'John', age: 30 };
    
    storage.set('user', testData);
    const retrieved = storage.get<typeof testData>('user');
    expect(retrieved).toEqual(testData);
  });

  it('should work with prefixes', () => {
    const storage = new LocalStorage({ prefix: 'app' });
    storage.set('key', 'value');
    
    expect(localStorage.getItem('app:key')).toBe('"value"');
    expect(storage.get<string>('key')).toBe('value');
  });

  it('should return default value when key not found', () => {
    const storage = new LocalStorage();
    const defaultValue = { default: true };
    
    const result = storage.get('nonexistent', defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it('should check if key exists', () => {
    const storage = new LocalStorage();
    
    storage.set('existingKey', 'value');
    expect(storage.has('existingKey')).toBe(true);
    expect(storage.has('nonexistentKey')).toBe(false);
  });

  it('should remove specific keys', () => {
    const storage = new LocalStorage();
    
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.remove('key1');
    
    expect(storage.has('key1')).toBe(false);
    expect(storage.has('key2')).toBe(true);
  });

  it('should clear only prefixed items', () => {
    const appStorage = new LocalStorage({ prefix: 'app' });
    const userStorage = new LocalStorage({ prefix: 'user' });
    
    appStorage.set('key1', 'value1');
    userStorage.set('key1', 'value2');
    
    appStorage.clear();
    
    expect(appStorage.has('key1')).toBe(false);
    expect(userStorage.has('key1')).toBe(true);
  });

  it('should work with custom serializer', () => {
    interface TestData {
      test: string;
    }

    const customSerializer = {
      stringify: <T>(value: T): string => {
        const jsonString = JSON.stringify(value);
        return Buffer.from(jsonString).toString('base64');
      },
      parse: <T>(value: string): T => {
        const jsonString = Buffer.from(value, 'base64').toString();
        return JSON.parse(jsonString);
      }
    };
    
    const storage = createStorage({ serializer: customSerializer });
    const testData: TestData = { test: 'data' };
    
    storage.set('encoded', testData);
    const result = storage.get<TestData>('encoded');
    expect(result).toEqual(testData);
  });
}); 