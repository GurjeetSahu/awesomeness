"use client";
import { signOut } from "next-auth/react";
import { ChevronsDown, LogOut, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

export function User() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar>
            <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {session?.user?.name}
            </span>
          </div>
          <ChevronsDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg "
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem>
          <RefreshCcw />
          <Button
            className="ml-3"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["all-stars"] });
              alert("Refreshing! Please wait for the data to load.");
            }}
          >
            Refresh
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut />
          <Button className="ml-3" onClick={() => signOut()}>
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
