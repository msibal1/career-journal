export type Metric = {
  id: string;
  label: string;
  value: string;
};

export type Entry = {
  id: string;
  weekISO: string;
  weekStart: string;
  createdAt: string;
  updatedAt: string;
  wins: string[];
  metrics: Metric[];
  skills: string[];
  projects: string[];
  notes: string;
};

export type Settings = {
  name: string;
  fridayNudge: boolean;
  welcomeSeen: boolean;
};

export type Store = {
  version: 1;
  settings: Settings;
  entries: Entry[];
};

export const DEFAULT_STORE: Store = {
  version: 1,
  settings: {
    name: "",
    fridayNudge: false,
    welcomeSeen: false,
  },
  entries: [],
};
