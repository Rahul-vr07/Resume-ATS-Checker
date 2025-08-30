import { useState, useEffect } from 'react';

type StorageValue<T> = {
  data: T;
  timestamp: number;
};

export function useOfflineStorage<T>(
  key: string,
  initialValue: T,
  expiration: number = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
): [T, (value: T) => void, boolean] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      if (item) {
        const parsedItem = JSON.parse(item) as StorageValue<T>;
        
        // Check if the stored data has expired
        const now = new Date().getTime();
        if (now - parsedItem.timestamp > expiration) {
          // Data has expired, return initial value
          return initialValue;
        }
        
        return parsedItem.data;
      }
      
      return initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });
  
  const [isStale, setIsStale] = useState<boolean>(false);
  
  // Check if the data is stale (exists but older than preferred freshness)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item) as StorageValue<T>;
        const now = new Date().getTime();
        // Consider data stale if it's older than 1 hour but not expired
        setIsStale(now - parsedItem.timestamp > 60 * 60 * 1000 && now - parsedItem.timestamp < expiration);
      }
    } catch (error) {
      console.error("Error checking staleness:", error);
    }
  }, [key, expiration]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      setIsStale(false);
      
      // Save to local storage
      const storageValue: StorageValue<T> = {
        data: valueToStore,
        timestamp: new Date().getTime()
      };
      
      window.localStorage.setItem(key, JSON.stringify(storageValue));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue, isStale];
}