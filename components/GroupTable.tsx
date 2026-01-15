"use client";

//Top level
import { useEffect, useState } from "react";

//MID LEVEL
import RepoManager from "@/lib/repoManager";
import type { Category } from "@/lib/useStore";
import { useRepoStore } from "@/lib/useStore";
import { useCategoryStore } from "@/lib/useStore";

//UI LEVEL
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function CategoryItem({
  node,
  onCategoryClick,
}: {
  node: Category;
  onCategoryClick?: (category: Category) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center space-x-2">
        {node.children ? (
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-2 py-1 w-full justify-start hover:bg-muted rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick?.(node);
              }}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />

              <span className="truncate">{node.name}</span>
            </Button>
          </CollapsibleTrigger>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="pl-8 pr-2 py-1 w-full justify-start hover:bg-muted rounded-md"
            onClick={() => onCategoryClick?.(node)}
          >
            <span className="truncate">{node.name}</span>
          </Button>
        )}
      </div>

      {node.children && (
        <CollapsibleContent className="pl-6">
          <div className="space-y-1 border-l border-muted-foreground/20 ml-2 pl-2">
            {node.children.map((child) => (
              <CategoryItem
                key={child.id}
                node={child}
                onCategoryClick={onCategoryClick}
              />
            ))}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

// Main component
export default function CategoryTree() {
  const {
    options: OPTIONS,
    currentCategory,
    setCurrentCategory,
  } = useCategoryStore();
  const { setRepos } = useRepoStore();
  const [repoManager] = useState(() => new RepoManager());
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCategoryClick = async (cat: Category) => {
    setCurrentCategory?.(cat.name);
    setRepos(await repoManager.getReposByCategory(cat.id));
  };

  const hcc = async () => {
    setRepos(await repoManager.getAllRepos());
  };

  // Fetch categories on mount
  useState(() => {
    let isMounted = true;
    repoManager.getCategoryTreeFromDexie().then((data) => {
      if (isMounted) setCategories(data);
    });
    return () => {
      isMounted = false;
    };
  });

  useEffect(() => {
    (async () => {
      let isMounted = true;
      repoManager.getCategoryTreeFromDexie().then((data) => {
        if (isMounted) setCategories(data);
      });
      return () => {
        isMounted = false;
      };
    })();
  }, [OPTIONS]);
  return (
    <div className="p-4 space-y-2 w-full bg-card border rounded-lg shadow-sm">
      <div className="space-y-1">
        <h3>{currentCategory || "All Stars"}</h3>
        <Button className="bg-green-500" onClick={() => hcc()}>
          All Stars
        </Button>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            node={cat}
            onCategoryClick={handleCategoryClick}
          />
        ))}
      </div>
    </div>
  );
}
