import Dexie, { Table } from 'dexie';
import { Category } from './useStore';

export default class RepoManager {
  private db: Dexie;

  private categoriesTable: Table<Category>;
  private reposTable: Table<any, any>;
  private categoryMapEntry: Table<any, any>;

  constructor() {
    this.db = new Dexie('Awesomeness');
    this.db.version(1).stores({
      categories: '++id,name,parentId',
      mapEntries: "++order,key",
      categoryMapEntry: '++id, categoryId, mapEntryId, [categoryId+mapEntryId]'
    });
    this.categoriesTable = this.db.table('categories');
    this.reposTable = this.db.table('mapEntries');
    this.categoryMapEntry = this.db.table('categoryMapEntry');
  }

  //Used by GroupTable to get all categories on mount
  async getAllCategories(): Promise<any> {
    const categories = await this.categoriesTable.toArray();
    return categories.map(category => category);
  }

  //Get On Mount and On button click "All Stars"
  async getAllRepos(): Promise<any> {
    //const entries = await this.reposTable.orderBy("order").reverse().toArray();
    const entries = await this.reposTable.orderBy("order").reverse().toArray();
    const restoredMap = new Map(entries.map(({ key, value }) => [key, value]));
    const values = Array.from(restoredMap.values());
    return values
  }

  //Category button to repo table
  async getReposByCategory(categoryId: string | number): Promise<any> {
    const links = await this.categoryMapEntry.where("categoryId").equals(categoryId).toArray();
    const entryIds = links.map(l => l.mapEntryId);
    console.log(entryIds)

    const values = (await this.reposTable.where("key").anyOf(entryIds).toArray())
      .map(e => e?.value);
    return values;
  }

  //NewCategory.tsx uses this to create new category
  async addCategory(category: string, parentId?: Number | null): Promise<boolean> {
    console.log("Adding category", category, parentId);
    await this.categoriesTable.add({ name: category, parentId: parentId } as Category);
    return true;
  }

  //(Getter) Repo's Categories; The Add button You see in front of each repo in RepoList
  async getCategoriesByRepo(repoId: string | number): Promise<any> {
    const links = await this.categoryMapEntry.where("mapEntryId").equals(repoId).toArray();
    const categoryIds = links.map(l => l.categoryId);
    const values = (await this.categoriesTable.bulkGet(categoryIds))
      .filter(e => e)
      .map(e => ({ id: e!.id, name: e!.name }));
    return values;
  }

  //(Setter) (Repo's Categories) The Add button You see in front of each repo in RepoList
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

  //Used after fetching from Github API
  async saveReposLocally(repos: any) {
    await this.reposTable.bulkPut(
      Array.from(repos, ([key, value], index) => ({ key, value }))
    );
  }

  //Used by GroupTable on Mount to build Category Tree
  async getCategoryTreeFromDexie(): Promise<Category[]> {
    const [categories, repos, repoCategories] = await Promise.all([
      this.categoriesTable.toArray(),
      this.reposTable.toArray(),
      this.categoryMapEntry.toArray(),
    ]);

    // Map categories by id
    const map = new Map<number, Category>();
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
    const roots: Category[] = [];
    map.forEach((node) => {
      if (!node.parentId) roots.push(node);
      else {
        const parent = map.get(node.parentId);
        if (parent && parent.children) parent.children.push(node);
      }
    });
    return roots;

  }
}