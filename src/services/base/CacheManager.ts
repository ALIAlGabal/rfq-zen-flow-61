import { CacheEntry, CacheManager } from '@/types/api';
import { SERVICE_CONFIG } from '@/config/api';

// In-memory cache implementation
class InMemoryCacheManager implements CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private timers = new Map<string, NodeJS.Timeout>();

  get<T>(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }
    
    return entry as CacheEntry<T>;
  }

  set<T>(key: string, data: T, ttl: number = SERVICE_CONFIG.cacheDuration): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
    
    // Clear existing timer
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Set new entry
    this.cache.set(key, entry);
    
    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);
    
    this.timers.set(key, timer);
  }

  delete(key: string): void {
    this.cache.delete(key);
    
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  clear(): void {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    // Clear cache
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key) && Date.now() <= this.cache.get(key)!.expiresAt;
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.delete(key));
  }
}

// Create cache manager instance
export const cacheManager = new InMemoryCacheManager();

// Auto cleanup every 5 minutes
if (SERVICE_CONFIG.enableCaching) {
  setInterval(() => {
    cacheManager.cleanup();
  }, 5 * 60 * 1000);
}