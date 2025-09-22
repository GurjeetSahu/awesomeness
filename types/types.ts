export type Repo = {
  nameWithOwner:string,
  databaseId:string
  id: string;
  name: string;
  stars: number;
  language: string;
  groups?: string[];
};
export type RepoMap = Record<string, Repo>;

export type Category = {
  id?: string;
  name: string;
  repos?: string[];
};

export type Categories = Array<Category>

export type CategoryContextType = {
  categories: Categories
  updateCategories: (newCategories: Category) => void;
};

export type ListContextType = {
  list: any
  isLoading: boolean;
  error: string | null;
  setList: any;
  activeList: any;
  setActiveList: any;
  updateArray: any;
};
