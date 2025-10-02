import Dexie, { Table } from 'dexie';

interface Repo {
  databaseId: number;
  nameWithOwner: string;
  description: string;
  stargazerCount?: number
}

interface Category {
  id: number;
  name: string;
  parentId?: number;
}



export interface CategoryNode extends Category {
  children: CategoryNode[];
  repos: Repo[]; // add repos here
}


export default class RepoManager {
  private db: Dexie;

  private categoriesTable: Table<Category>;
  private reposTable: Table<any, any>;
  private categoryMapEntry: Table<any, any>;

  constructor() {
    this.db = new Dexie('Awesomeness');
    this.db.version(1).stores({
      categories: '++id,name,parentId',
      mapEntries: "++order",
      categoryMapEntry: '++id, categoryId, mapEntryId, [categoryId+mapEntryId]'
    });
    this.categoriesTable = this.db.table('categories');
    this.reposTable = this.db.table('mapEntries');
    this.categoryMapEntry = this.db.table('categoryMapEntry');
  }

  async getAllCategories(): Promise<any> {
    const categories = await this.categoriesTable.toArray();
    return categories.map(category => category);
  }

  async getAllRepos(): Promise<any> {
    //const entries = await this.reposTable.orderBy("order").reverse().toArray();
    const entries = await this.reposTable.orderBy("order").reverse().toArray();
    const restoredMap = new Map(entries.map(({ key, value }) => [key, value]));
    const values = Array.from(restoredMap.values());
    return values
  }

  async getReposByCategory(categoryId: string | number): Promise<any> {
    const links = await this.categoryMapEntry.where("categoryId").equals(categoryId).toArray();
    const entryIds = links.map(l => l.mapEntryId);
    const values = (await this.reposTable.bulkGet(entryIds))
      .map(e => e?.value);
    return values;
  }
  async getCategoriesByRepo(repoId: string | number): Promise<any> {
    const links = await this.categoryMapEntry.where("mapEntryId").equals(repoId).toArray();
    const categoryIds = links.map(l => l.categoryId);
    const values = (await this.categoriesTable.bulkGet(categoryIds))
      .filter(e => e)
      .map(e => ({ id: e!.id, name: e!.name }));
    return values;
  }


  async addCategory(category: string, parentId?: Number | null): Promise<boolean> {
    console.log("Adding category", category, parentId);
    await this.categoriesTable.add({ name: category,parentId:parentId } as Category);
    return true;
  }

  async ModifyRepoCategory(repoId: string, catId: number, state: boolean): Promise<boolean> {
    if (!state) {
      await this.categoryMapEntry
        .where("[categoryId+mapEntryId]")
        .equals([catId, repoId.toString()])
        .delete();
    }
    else {
      await this.categoryMapEntry.add({ categoryId: catId, mapEntryId: repoId.toString() });
    }
    return true;
  }

  async saveReposLocally(repos: any) {
    await this.reposTable.bulkPut(
      Array.from(repos, ([key, value], index) => ({ key, value}))
    );
  }

  async getCategoryTreeFromDexie(): Promise<CategoryNode[]> {
    const [categories, repos, repoCategories] = await Promise.all([
      this.categoriesTable.toArray(),
      this.reposTable.toArray(),
      this.categoryMapEntry.toArray(),
    ]);

    // Map categories by id
    const map = new Map<number, CategoryNode>();
    categories.forEach((cat) => map.set(cat.id!, { ...cat, children: [], repos: [] }));

    // Attach repos to categories
    repoCategories.forEach((rc) => {
      const cat = map.get(rc.categoryId);
      if (cat) {
        const repo = repos.find((r) => r.id === rc.repoId);
        if (repo) cat.repos.push(repo);
      }
    });

    // Build category tree
    const roots: CategoryNode[] = [];
    map.forEach((node) => {
      if (!node.parentId) roots.push(node);
      else {
        const parent = map.get(node.parentId);
        if (parent) parent.children.push(node);
      }
    });
    return roots;

  }
}