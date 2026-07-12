import 'server-only';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function getAdminDb() {
  if (getApps().length > 0) return getFirestore();

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Ensure FIREBASE_PROJECT_ID, ' +
      'FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in .env.local'
    );
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return getFirestore();
}

// ─── Helper utilities ─────────────────────────────────────────────────────────

export async function getCollection<T extends object>(
  collection: string,
  orderByField = 'createdAt',
  direction: 'asc' | 'desc' = 'desc'
): Promise<(T & { id: string })[]> {
  try {
    const adminDb = getAdminDb();
    const snap = await adminDb
      .collection(collection)
      .orderBy(orderByField, direction)
      .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  } catch {
    // If no index / first run — fall back to unordered
    const adminDb = getAdminDb();
    const snap = await adminDb.collection(collection).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  }
}

export async function getDocument<T extends object>(
  collection: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const adminDb = getAdminDb();
  const doc = await adminDb.collection(collection).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as T & { id: string };
}

export async function createDocument(
  collection: string,
  data: Record<string, unknown>
): Promise<string> {
  const now = new Date().toISOString();
  const adminDb = getAdminDb();
  const ref = await adminDb.collection(collection).add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateDocument(
  collection: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const adminDb = getAdminDb();
  await adminDb.collection(collection).doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteDocument(
  collection: string,
  id: string
): Promise<void> {
  const adminDb = getAdminDb();
  await adminDb.collection(collection).doc(id).delete();
}

export async function getCollectionCount(collection: string): Promise<number> {
  try {
    const adminDb = getAdminDb();
    const snap = await adminDb.collection(collection).count().get();
    return snap.data().count;
  } catch {
    const adminDb = getAdminDb();
    const snap = await adminDb.collection(collection).get();
    return snap.size;
  }
}
