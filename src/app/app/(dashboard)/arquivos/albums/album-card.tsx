import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder } from "./page";
import Link from "next/link";

export function AlbumCard({ folder }: { folder: Folder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{folder.name}</CardTitle>
        <CardDescription>
          Todos os arquivos do album {folder.name}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/arquivos/albums/${folder.name}`}>Ver Album</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}