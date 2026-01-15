//Global store for repos and categorise using zustand
import { create } from "zustand";

export interface Repo {
  databaseId: number;
  nameWithOwner: string;
  description: string;
  stargazerCount?: number;
  primaryLanguage?: { name: string; color: string };
  categories?: string[];
}
//Visible on repo list UI
export interface RepoState {
  repos: Repo[];
  setRepos: (repos: Repo[]) => void;
  addRepo: (repo: Repo) => void;
  clearRepos: () => void;
}
//
export interface Category {
  id: number;
  name: string;
  parentId?: number;
  children?: Category[];
  repos: Repo[];
}
//These are only for giving MultipleSelector add parent category UI while creating new category
export interface CategoryOption {
  value: string | number;
  label: string;
}

export interface CategoryState {
  currentCategory: string;
  options: CategoryOption[];
  setOptions: (opts: CategoryOption[]) => void;
  setCurrentCategory?: (cat: string) => void;
}


export const useRepoStore = create<RepoState>((set) => ({
  repos: [],
  setRepos: (repos) => set({ repos }),
  addRepo: (repo) =>
    set((state) => ({ repos: [...state.repos, repo] })),
  clearRepos: () => set({ repos: [] }),
}));

export const useCategoryStore = create<CategoryState>((set) => ({
  currentCategory: "",
  options: [],
  setOptions: (opts) => set({ options: opts }),
  setCurrentCategory: (cat) => set({ currentCategory: cat })
}));
