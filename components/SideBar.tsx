"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import NewCategory from "@/components/NewCategory";
import CategoryTree from "@/components/GroupTable";

export default function Tab() {
  return (
    <ScrollArea className="h-full">
      <NewCategory />
      <CategoryTree />
    </ScrollArea>
  );
}
