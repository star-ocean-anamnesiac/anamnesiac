
export interface Note {
  name: string;
  notes?: string;
}

export interface Update {
  date: string;
  general?: Note[];
  characterAdditions?: Note[];
  characterChanges?: Note[];
  itemAdditions?: Note[];
  itemChanges?: Note[];
}
