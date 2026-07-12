import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';

export async function getClientCollection<T>(colName: string, orderByField = 'createdAt', direction: 'asc' | 'desc' = 'desc'): Promise<(T & { id: string })[]> {
  try {
    const q = query(collection(db, colName), orderBy(orderByField, direction));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as T & { id: string }));
  } catch (err) {
    // Fallback if no index
    const snap = await getDocs(collection(db, colName));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as T & { id: string }));
  }
}

export async function getClientDocument<T>(colName: string, id: string): Promise<(T & { id: string }) | null> {
  const d = await getDoc(doc(db, colName, id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as T & { id: string };
}

export async function createClientDocument(colName: string, data: any): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, colName), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateClientDocument(colName: string, id: string, data: any): Promise<void> {
  await updateDoc(doc(db, colName, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteClientDocument(colName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, colName, id));
}

export async function getClientCollectionCount(colName: string): Promise<number> {
  const snap = await getCountFromServer(collection(db, colName));
  return snap.data().count;
}
