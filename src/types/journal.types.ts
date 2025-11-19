export interface JournalEntry {
  id: string
  career_id: string
  season: number
  entry_date: string
  title: string
  content: string
  tags?: string[]
  images?: string[]
  created_at: string
  updated_at: string
}

export interface CreateJournalInput {
  season: number
  entry_date: string
  title: string
  content: string
  tags?: string[]
}

export interface UpdateJournalInput extends Partial<CreateJournalInput> {}
