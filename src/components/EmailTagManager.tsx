import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Plus, X, Save } from "lucide-react";

interface TagManagerProps {
  children: React.ReactNode;
  onTagsUpdate?: (tags: string[]) => void;
  currentTags?: string[];
}

export const EmailTagManager = ({ children, onTagsUpdate, currentTags = [] }: TagManagerProps) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(currentTags);
  const [newTag, setNewTag] = useState("");

  const predefinedTags = [
    "Urgentné", "Projekty", "Stretnutia", "Obchodné", "Osobné",
    "Faktúry", "Dokumenty", "Zákazníci", "Tím", "Marketing"
  ];

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      setTags(updatedTags);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
  };

  const handleSave = () => {
    onTagsUpdate?.(tags);
    setOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Správa tagov</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Tags */}
          <div className="space-y-2">
            <Label>Aktuálne tagy</Label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-lg">
              {tags.length === 0 ? (
                <span className="text-muted-foreground text-sm">Žiadne tagy</span>
              ) : (
                tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Add New Tag */}
          <div className="space-y-2">
            <Label htmlFor="newTag">Pridať nový tag</Label>
            <div className="flex gap-2">
              <Input
                id="newTag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napíšte názov tagu"
              />
              <Button 
                type="button" 
                onClick={() => addTag(newTag)}
                disabled={!newTag || tags.includes(newTag)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Predefined Tags */}
          <div className="space-y-2">
            <Label>Rýchle tagy</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <Button
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Uložiť tagy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};