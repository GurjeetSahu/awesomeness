import { create } from "zustand";

interface Repo {
  databaseId: number;
  nameWithOwner: string;
  description: string;
  stargazerCount?: number;
  primaryLanguage?: { name: string; color: string };
  categories?: string[];
}

interface RepoState {
  repos: Repo[];
  setRepos: (repos: Repo[]) => void;
  addRepo: (repo: Repo) => void;
  clearRepos: () => void;
}

interface CategoryOption {
  value: string | number;
  label: string;
}

interface CategoryState {
  options: CategoryOption[];
  setOptions: (opts: CategoryOption[]) => void;
}

export const useRepoStore = create<RepoState>((set) => ({
  repos: [],
  setRepos: (repos) => set({ repos }),
  addRepo: (repo) =>
    set((state) => ({ repos: [...state.repos, repo] })),
  clearRepos: () => set({ repos: [] }),
}));

export const useCategoryStore = create<CategoryState>((set) => ({
  options: [],
  setOptions: (opts) => set({ options: opts }),
}));
