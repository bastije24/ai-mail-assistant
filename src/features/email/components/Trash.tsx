import { Trash2, Archive, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EmailListProps } from "../types";

export const Trash = ({ emails }: EmailListProps) => {
  const deletedEmails = emails.filter(email => email.status === "deleted");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
          <Trash2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Kôš</h1>
          <p className="text-sm text-muted-foreground">Zmazané emaily ({deletedEmails.length})</p>
        </div>
      </div>

      {deletedEmails.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">Kôš je prázdny</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {deletedEmails.map((email) => (
            <Card key={email.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-muted-foreground line-clamp-1">
                        {email.subject}
                      </h3>
                      {email.isUrgent && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Urgentné
                        </Badge>
                      )}
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                        Zmazané
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Od: {email.from}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{email.content}</p>
                    {email.deletedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Zmazané: {formatDate(email.deletedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-muted-foreground">{formatDate(email.timestamp)}</span>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        title="Obnoviť email"
                        onClick={() => {
                          console.log(`Restoring email ${email.id}`);
                          // Restore functionality would be implemented here
                        }}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        title="Odstrániť natrvalo"
                        onClick={() => {
                          console.log(`Permanently deleting email ${email.id}`);
                          // Permanent delete functionality would be implemented here
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};