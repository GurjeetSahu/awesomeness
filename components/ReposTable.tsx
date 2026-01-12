"use client";

import { useEffect, useMemo, useState } from "react";

import CheckBox from "@/components/ModifyCategories";
import DownLoadbtn from "@/components/Download";
import { create } from "zustand";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import RepoManager from "@/lib/repoManager";
import useStars from "@/lib/useStars";

import { useRepoStore } from "@/lib/useRepoStore";
import ExportBtn from "./exportBtn";

export default function ReposTable() {
  const [repoManager] = useState(() => new RepoManager());
  const { repos, setRepos } = useRepoStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const { allStars: repoMap, isLoading, isFetching } = useStars();

  useEffect(() => {
    (async function () {
      if (repoMap !== undefined) {
        if (repoMap.size !== undefined) {
          await repoManager.saveReposLocally(repoMap);
          setRepos(await repoManager.getAllRepos());
        }
        setRepos(await repoManager.getAllRepos());
      }
    })();
  }, [repoMap, repoManager, setRepos]);

  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.nameWithOwner.split("/")[1], {
        id: "name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("stargazerCount", {
        cell: (info) => info.getValue(),
        id: "Stars",
      }),
      columnHelper.accessor("primaryLanguage.name", {
        cell: (info) => info.getValue(),
        id: "language",
      }),
    ],
    []
  );

  const table = useReactTable({
    data: repos ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  if (isFetching || isLoading) {
    return (
      <div>
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          The Stars are being fetched, please wait and do not close this tab...
        </h1>
      </div>
    );
  }
  return (
    <div className="">
      <div className="mb-4 flex flex-column gap-2 ">
        {table.getAllColumns().map((col) => {
          const sortState = col.getIsSorted();

          return (
            <Button
              className="bg-sky-500"
              key={col.id}
              onClick={() => col.toggleSorting()}
            >
              {col.id.charAt(0).toUpperCase() + col.id.slice(1)}
              {sortState === "asc" ? " 🔼" : sortState === "desc" ? " 🔽" : ""}
            </Button>
          );
        })}
        {/* <DownLoadbtn
          starred={{
            "Web Development": [
              { name: "cli/cli", stars: 38708 },
              { name: "shadcn-ui/ui", stars: 84344 },
              { name: "nextauthjs/next-auth", stars: 26403 },
            ],
          }}
        /> */}
        <ExportBtn />
      </div>
      <ScrollArea className="h-[calc(100dvh-150px)] w-full border">
        <div className=" flex flex-col ">
          {table.getRowModel().rows.map((row) => {
            const repo = row.original;
            return (
              <div
                key={repo.databaseId}
                className=" p-6 pb-0 hover:bg-gray-300  dark:hover:bg-gray-600  transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold">
                    <a href={`https://github.com/${repo.nameWithOwner}`}>
                      {repo.nameWithOwner}
                    </a>
                  </div>

                  <div className="text-lg font-bold">
                    {JSON.stringify(repo.categories)}
                  </div>

                  <span className="text-smy px-2 py-1 rounded">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Add</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <CheckBox repoId={repo.databaseId} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </span>
                </div>
                <div className="pb-5">{repo.description}</div>
                <div className="text-sm mb-1">
                  ⭐{repo.stargazerCount ?? "N/A"}{" "}
                  <Badge
                    variant="default"
                    style={{ backgroundColor: repo.primaryLanguage?.color }}
                  >
                    {repo.primaryLanguage?.name ?? "N/A"}
                  </Badge>
                </div>

                <Separator />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
