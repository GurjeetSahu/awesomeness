"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/components/User";
import NewCategory from "@/components/NewCategory";
import CategoryTree from "@/components/GroupTable";

export default function Tab() {
  return (
    <ScrollArea className="h-full">
      <User />
      <NewCategory />
      <CategoryTree />
    </ScrollArea>
  );
}
