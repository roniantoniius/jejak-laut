// import { useEffect, useState } from "react";
// import localforage from "localforage";

// localforage.config({
//   driver: localforage.INDEXEDDB, // Force using IndexedDB
//   name: 'jejak-laut',
//   version: 1.0,
//   storeName: 'notes', // Should be alphanumeric, with underscores.
//   description: 'Storage for Jejak Laut application',
// });

// const migrateData = async () => {
//   const notes = localStorage.getItem('NOTES');
//   const tags = localStorage.getItem('TAGS');

//   if (notes) {
//     await localforage.setItem('NOTES', JSON.parse(notes));
//   }

//   if (tags) {
//     await localforage.setItem('TAGS', JSON.parse(tags));
//   }

//   // Clear localStorage after migration
//   localStorage.removeItem('NOTES');
//   localStorage.removeItem('TAGS');
// };

// export function useLocalForage<T>(key: string, initialValue: T | (() => T)) {
//   const [value, setValue] = useState<T>(initialValue as T);

//   useEffect(() => {
//     const fetchData = async () => {
//       const storedValue = await localforage.getItem<T>(key);
//       if (storedValue !== null) {
//         setValue(storedValue);
//       } else {
//         setValue(initialValue as T);
//       }
//     };

//     fetchData();
//   }, [key, initialValue]);

//   useEffect(() => {
//     localforage.setItem(key, value);
//   }, [value, key]);

//   useEffect(() => {
//     // Migrate data from localStorage to localForage on initial load
//     migrateData();
//   }, []);

//   return [value, setValue] as [T, typeof setValue];
// }

// export default localforage;