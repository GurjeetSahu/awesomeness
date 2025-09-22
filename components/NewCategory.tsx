"use client";
import React, { useEffect, useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";

import { Plus } from "lucide-react";
import { z } from "zod";
import RepoManager from "@/lib/repoManager";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useCategoryStore } from "@/lib/useRepoStore";

const MultipleSelectorWithDisabledOption = () => {
  const { options: OPTIONS, setOptions } = useCategoryStore();
  const [repoManager] = useState(() => new RepoManager());

  const FormSchema = z.object({
    name: z.string(),
    id: z.string(),
    repos: z.string(),
  });

  const { register, handleSubmit, setValue } =
    useForm<z.infer<typeof FormSchema>>();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    await repoManager.addCategory(data.name,data.repos ? Number(data.repos) : null);
  }
  useEffect(() => {
    (async () => {
      const cats = await repoManager.getCategoryTreeFromDexie();
      setOptions(
        cats.map(({ name, id }) => ({ value: String(id), label: name }))
      );
    })();
  }, [setOptions]);
  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" w-full mb-2 bg-green-500">
            <Plus />
            Add Club
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogDescription></DialogDescription>

          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="name">Name</Label>
            <input
              className="border border-2"
              {...register("name", { required: true })}
            />

            <MultipleSelector
              defaultOptions={OPTIONS.map((opt) => ({
                ...opt,
                value: String(opt.value),
              }))}
              placeholder="Add Parent Category"
              emptyIndicator={<p className="">no results found.</p>}
              onChange={(selected: any) => {
                setValue("repos", selected[0].value);
              }}
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="submit" variant="outline">
                  Save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogDescription></AlertDialogDescription>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    The category has been created! Please Refresh
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultipleSelectorWithDisabledOption;
