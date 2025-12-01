"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

import { Dexie } from "dexie";
import {
  importDB,
  exportDB,
  importInto,
  peakImportFile,
} from "dexie-export-import";
import RepoManager from "@/lib/repoManager";

export default function ExportBtn() {
  //const [repoManager] = useState(() => new RepoManager());
  //const blob = await exportDB(repoManager.db);

  const db = new Dexie("Awesomeness");
  //const blob = exportDB(db);
  return (
    <div></div>
  );
}
