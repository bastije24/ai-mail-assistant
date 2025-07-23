import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EmailListProps } from "../types";

export const Trash = ({ emails }: EmailListProps) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Kôš</h1>
          <p className="text-sm text-muted-foreground">Zmazané emaily</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Kôš je prázdny</div>
        </CardContent>
      </Card>
    </div>
  );
};