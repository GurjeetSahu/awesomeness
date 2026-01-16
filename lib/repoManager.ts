// All database interactions are handled in this file

import Dexie, { Table } from 'dexie';
import { Category } from '@/lib/useStore';

export default class RepoManager {
  private db: Dexie;

  private categoriesTable: Table<Category>;
  private reposTable: Table<any, any>;
  private categoryRepos: Table<any, any>;

  constructor() {
    this.db = new Dexie('Awesomeness');
    this.db.version(1).stores({
      categories: '++id,name,parentId',
      repos: "++order,key",
      categoryRepos: '++id, categoryId, repoId, [categoryId+repoId]'
    });
    this.categoriesTable = this.db.table('categories');
    this.reposTable = this.db.table('repos');
    this.categoryRepos = this.db.table('categoryRepos');
  }

  //Used by GroupTable to get all categories on mount
  async getAllCategories(): Promise<any> {
    const categories = await this.categoriesTable.toArray();
    return categories.map(category => category);
  }

  //Get On Mount and On button click "All Stars"
  async getAllRepos(): Promise<any> {
    const entries = await this.reposTable.orderBy("order").reverse().toArray();
    const restoredMap = new Map(entries.map(({ key, value }) => [key, value]));
    const values = Array.from(restoredMap.values());
    return values
  }

  //Category button to repo table
  async getReposByCategory(categoryId: string | number): Promise<any> {
    const links = await this.categoryRepos.where("categoryId").equals(categoryId).toArray();
    const entryIds = links.map(l => l.repoId);
    const values = (await this.reposTable.where("key").anyOf(entryIds).toArray())
      .map(e => e?.value);
    return values;
  }

  //NewCategory.tsx uses this to create new category
  async addCategory(category: string, parentId?: Number | null): Promise<boolean> {
    await this.categoriesTable.add({ name: category, parentId: parentId } as Category);
    return true;
  }

  //(Getter) Repo's Categories; The Add button You see in front of each repo in RepoList
  async getCategoriesByRepo(repoId: string | number): Promise<any> {
    const links = await this.categoryRepos.where("repoId").equals(repoId).toArray();
    const categoryIds = links.map(l => l.categoryId);
    const values = (await this.categoriesTable.bulkGet(categoryIds))
      .filter(e => e)
      .map(e => ({ id: e!.id, name: e!.name }));
    return values;
  }

  //(Setter) (Repo's Categories) The Add button You see in front of each repo in RepoList
  async ModifyRepoCategory(repoId: string, catId: number, state: boolean): Promise<boolean> {
    if (!state) {
      await this.categoryRepos
        .where("[categoryId+repoId]")
        .equals([catId, repoId.toString()])
        .delete();
    }
    else {
      await this.categoryRepos.add({ categoryId: catId, repoId: repoId.toString() });
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
      this.categoryRepos.toArray(),
    ]);

    // Map categories by id
    const catMap = new Map<number, Category>();
    categories.forEach((cat) => catMap.set(cat.id!, { ...cat, children: [], repos: [] }));

    // Attach repos to categories
    repoCategories.forEach((rc) => {
      const cat = catMap.get(rc.categoryId);
      if (cat) {
        const repo = repos.find((r) => r.id === rc.repoId);
        if (repo) cat.repos.push(repo);
      }
    });

    // Build category tree
    const roots: Category[] = [];
    catMap.forEach((node) => {
      if (!node.parentId) roots.push(node);
      else {
        const parent = catMap.get(node.parentId);
        if (parent && parent.children) parent.children.push(node);
      }
    });
    return roots;

  }
}