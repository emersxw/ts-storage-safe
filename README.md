# ts-storage-safe

A type-safe, feature-rich wrapper for localStorage with support for prefixing, custom serialization, and namespacing.

## Features

- 🔒 **Type-safe**: Full TypeScript support with generic types
- 🔑 **Namespacing**: Prefix your storage keys to avoid conflicts
- 🔄 **Custom Serialization**: Use your own serialization methods
- 🚀 **Simple API**: Intuitive methods for all localStorage operations
- ⚡ **Error Handling**: Proper error handling with descriptive messages
- 🧪 **Well Tested**: Comprehensive test coverage

## Installation

```bash
npm install ts-storage-safe
```

## Basic Usage

```typescript
import { storage } from 'ts-storage-safe';

// Store data with type safety
interface User {
  name: string;
  age: number;
}

storage.set<User>('user', { name: 'John', age: 30 });

// Retrieve data with type inference
const user = storage.get<User>('user');
console.log(user?.name); // John

// Check if key exists
if (storage.has('user')) {
  // Key exists
}

// Remove specific item
storage.remove('user');

// Clear all items
storage.clear();
```

## Namespaced Storage

Create isolated storage instances with prefixes to avoid key conflicts:

```typescript
import { createStorage } from 'ts-storage-safe';

// Create namespaced storage instances
const userStorage = createStorage({ prefix: 'user' });
const appStorage = createStorage({ prefix: 'app' });

// Each storage instance has its own namespace
userStorage.set('theme', 'dark');     // Stored as 'user:theme'
appStorage.set('theme', 'light');     // Stored as 'app:theme'

// Clear only items in a specific namespace
userStorage.clear();  // Only clears items prefixed with 'user:'
```

## Custom Serialization

Implement custom serialization for special use cases:

```typescript
import { createStorage } from 'ts-storage-safe';

// Example: Base64 serialization
const secureStorage = createStorage({
  serializer: {
    stringify: <T>(value: T): string => {
      const jsonString = JSON.stringify(value);
      return Buffer.from(jsonString).toString('base64');
    },
    parse: <T>(value: string): T => {
      const jsonString = Buffer.from(value, 'base64').toString();
      return JSON.parse(jsonString);
    }
  }
});

// Data will be stored in base64 format
secureStorage.set('secret', { apiKey: '12345' });
```

## Default Values

Provide fallback values when retrieving data:

```typescript
interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
}

const defaultSettings: Settings = {
  theme: 'light',
  fontSize: 14
};

// Returns defaultSettings if 'settings' key doesn't exist
const settings = storage.get<Settings>('settings', defaultSettings);
```

## Error Handling

The library provides descriptive error messages:

```typescript
try {
  storage.set('data', new WeakMap()); // Non-serializable data
} catch (error) {
  console.error('Storage error:', error.message);
  // Error: Failed to set item: Invalid data structure
}
```

## API Reference

### Classes

#### `LocalStorage`

Main storage class with type-safe methods.

```typescript
class LocalStorage {
  constructor(options?: StorageOptions);
  
  set<T>(key: string, value: T): void;
  get<T>(key: string, defaultValue?: T): T | undefined;
  remove(key: string): void;
  clear(clearAll?: boolean): void;
  has(key: string): boolean;
}
```

### Interfaces

#### `StorageOptions`

Configuration options for creating storage instances.

```typescript
interface StorageOptions {
  prefix?: string;
  serializer?: {
    stringify: <T>(value: T) => string;
    parse: <T>(value: string) => T;
  };
}
```

### Exports

- `storage`: Default storage instance
- `createStorage`: Factory function for creating new storage instances
- `LocalStorage`: Storage class for extending or type references

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build package
npm run build

# Lint code
npm run lint
```

## Type Safety Examples

```typescript
// Type inference works automatically
storage.set('number', 42);
const num = storage.get<number>('number');  // type: number | undefined

// Complex types
interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  fontSize: number;
}

storage.set<UserPreferences>('prefs', {
  theme: 'dark',
  notifications: true,
  fontSize: 16
});

// TypeScript will enforce correct types
const prefs = storage.get<UserPreferences>('prefs');
if (prefs?.theme === 'dark') {
  // Type-safe access to properties
}
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues

Please file any issues, bugs, or feature requests in the [issue tracker](https://github.com/yourusername/ts-storage-safe/issues).