"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, FolderTree } from "lucide-react";
import RepoManager from "@/lib/repoManager";
import type { CategoryNode } from "@/lib/repoManager";
import { useRepoStore } from "@/lib/useRepoStore";

function CategoryItem({
  node,
  onCategoryClick,
}: {
  node: CategoryNode;
  onCategoryClick?: (category: CategoryNode) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center space-x-2">
        {node.children.length > 0 ? (
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

      {node.children.length > 0 && (
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
  const { setRepos } = useRepoStore();
  const [repoManager] = useState(() => new RepoManager());
  const [categories, setCategories] = useState<CategoryNode[]>([]);

  const handleCategoryClick = async (cat: CategoryNode) => {
    setRepos(await repoManager.getReposByCategory(cat.id));
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

  return (
    <div className="p-4 space-y-2 w-full bg-card border rounded-lg shadow-sm">
      <div className="space-y-1">
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
