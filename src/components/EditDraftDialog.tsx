import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileEdit, Save, Send, X } from "lucide-react";

interface Draft {
  id: string;
  to: string;
  toName: string;
  subject: string;
  lastModified: Date;
  wordCount: number;
  status: string;
  previewText: string;
  category: string;
  priority: string;
}

interface EditDraftDialogProps {
  children: React.ReactNode;
  draft: Draft;
  onDraftUpdate: (draft: Draft) => void;
  onDraftSend?: (draftId: string) => void;
}

export const EditDraftDialog = ({ children, draft, onDraftUpdate, onDraftSend }: EditDraftDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    to: draft.to,
    subject: draft.subject,
    content: draft.previewText.replace("...", ""), // Remove truncation indicator
    priority: draft.priority,
    category: draft.category
  });

  const handleSave = () => {
    const updatedDraft: Draft = {
      ...draft,
      to: formData.to,
      toName: formData.to.split('@')[0],
      subject: formData.subject,
      priority: formData.priority,
      category: formData.category,
      previewText: formData.content.substring(0, 100) + "...",
      lastModified: new Date(),
      wordCount: formData.content.split(' ').length,
      status: "draft"
    };

    onDraftUpdate(updatedDraft);
    setOpen(false);
  };

  const handleSendNow = () => {
    handleSave(); // Save first
    onDraftSend?.(draft.id);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px] sm:w-[600px] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Pokračovať v písaní emailu</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">Pre</Label>
            <Input
              id="to"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Predmet</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Predmet emailu"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priorita</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vysoká">Vysoká</SelectItem>
                  <SelectItem value="Stredná">Stredná</SelectItem>
                  <SelectItem value="Nízka">Nízka</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategória</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Odpoveď">Odpoveď</SelectItem>
                  <SelectItem value="Plánování">Plánovanie</SelectItem>
                  <SelectItem value="Návrh">Návrh</SelectItem>
                  <SelectItem value="Update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Obsah emailu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Pokračujte v písaní vášho emailu..."
              rows={12}
              className="min-h-[300px]"
            />
            <div className="text-xs text-muted-foreground">
              {formData.content.split(' ').filter(word => word.length > 0).length} slov
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Zrušiť
            </Button>
            <Button type="button" variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Uložiť draft
            </Button>
            <Button type="button" onClick={handleSendNow} className="bg-primary hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" />
              Odoslať teraz
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};