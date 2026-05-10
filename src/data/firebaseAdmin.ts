import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const adminRef = doc(db, "admins", normalizeEmail(email));
  const adminSnap = await getDoc(adminRef);
  return adminSnap.exists();
}

export async function addAdminEmail(email: string) {
  const normalized = normalizeEmail(email);
  const adminRef = doc(db, "admins", normalized);
  await setDoc(adminRef, {
    email: normalized,
    createdAt: serverTimestamp(),
  });
}

export async function getAdmins(): Promise<string[]> {
  const adminsRef = collection(db, "admins");
  const q = query(adminsRef);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data().email as string);
}
