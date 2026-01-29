import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Career, CreateCareerInput, UpdateCareerInput, ProjectType } from '@/types/career.types'

const DEFAULT_PROJECT_TYPE: ProjectType = 'custom'

const toIsoString = (value?: Timestamp | string) => {
  if (!value) return new Date().toISOString()
  if (value instanceof Timestamp) return value.toDate().toISOString()
  return value
}

const normalizeCareer = (
  id: string,
  data: Partial<Career> & { created_at?: Timestamp | string; updated_at?: Timestamp | string },
  uid: string
): Career => {
  const nowIso = new Date().toISOString()
  return {
    id,
    user_id: data.user_id ?? uid,
    club_name: data.club_name ?? 'Unknown Club',
    club_id: data.club_id ?? null,
    league_name: data.league_name ?? 'Unknown League',
    country: data.country ?? 'Unknown',
    manager_name: data.manager_name ?? 'Unknown Manager',
    project_type: data.project_type ?? DEFAULT_PROJECT_TYPE,
    current_season: data.current_season ?? 1,
    budget: data.budget ?? 0,
    difficulty: data.difficulty ?? 'Normal',
    start_date: data.start_date ?? nowIso,
    is_active: data.is_active ?? true,
    is_archived: data.is_archived ?? false,
    settings: data.settings,
    created_at: toIsoString(data.created_at),
    updated_at: toIsoString(data.updated_at),
  }
}

export const listCareers = async (uid: string): Promise<Career[]> => {
  const careersRef = collection(db, 'users', uid, 'careers')
  const careersQuery = query(careersRef, orderBy('created_at', 'desc'))
  const snapshot = await getDocs(careersQuery)
  return snapshot.docs.map((docSnap) =>
    normalizeCareer(docSnap.id, docSnap.data() as Partial<Career>, uid)
  )
}

export const createCareer = async (
  uid: string,
  input: CreateCareerInput
): Promise<Career> => {
  const nowIso = new Date().toISOString()
  const payload = {
    user_id: uid,
    club_name: input.club_name,
    league_name: input.league_name,
    country: input.country ?? 'Unknown',
    manager_name: input.manager_name,
    project_type: input.project_type ?? DEFAULT_PROJECT_TYPE,
    current_season: input.current_season ?? 1,
    budget: input.budget ?? 0,
    difficulty: input.difficulty ?? 'Normal',
    start_date: nowIso,
    is_active: true,
    is_archived: false,
    settings: {},
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'users', uid, 'careers'), payload)
  return normalizeCareer(docRef.id, { ...payload, created_at: nowIso, updated_at: nowIso }, uid)
}

export const updateCareer = async (
  uid: string,
  id: string,
  patch: UpdateCareerInput
): Promise<Career> => {
  const ref = doc(db, 'users', uid, 'careers', id)
  const updatedAt = new Date().toISOString()
  await updateDoc(ref, { ...patch, updated_at: serverTimestamp() })
  const snapshot = await getDoc(ref)
  if (snapshot.exists()) {
    return normalizeCareer(snapshot.id, snapshot.data() as Partial<Career>, uid)
  }
  return normalizeCareer(id, { ...patch, updated_at: updatedAt }, uid)
}

export const deleteCareer = async (uid: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid, 'careers', id))
}

export const getCareer = async (uid: string, id: string): Promise<Career | null> => {
  const snapshot = await getDoc(doc(db, 'users', uid, 'careers', id))
  if (!snapshot.exists()) {
    return null
  }
  return normalizeCareer(snapshot.id, snapshot.data() as Partial<Career>, uid)
}
