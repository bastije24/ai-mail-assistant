import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Sparkles } from "lucide-react";

interface CreateAiTagDialogProps {
  children: React.ReactNode;
  onTagCreate?: (tag: { name: string; description: string; icon: string; keywords: string[] }) => void;
}

export const CreateAiTagDialog = ({ children, onTagCreate }: CreateAiTagDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("tag");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const iconOptions = [
    { value: "tag", label: "Tag", icon: "🏷️" },
    { value: "star", label: "Hviezda", icon: "⭐" },
    { value: "folder", label: "Priečinok", icon: "📁" },
    { value: "fire", label: "Urgentné", icon: "🔥" },
    { value: "money", label: "Financie", icon: "💰" },
    { value: "meeting", label: "Stretnutie", icon: "🤝" },
    { value: "work", label: "Práca", icon: "💼" },
    { value: "personal", label: "Osobné", icon: "❤️" },
    { value: "idea", label: "Nápad", icon: "💡" },
    { value: "document", label: "Dokument", icon: "📄" }
  ];

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSave = () => {
    if (!tagName.trim() || !description.trim()) return;

    const newTag = {
      name: tagName.trim(),
      description: description.trim(),
      icon: selectedIcon,
      keywords: keywords
    };

    onTagCreate?.(newTag);
    
    // Reset form
    setTagName("");
    setDescription("");
    setSelectedIcon("tag");
    setKeywords([]);
    setKeywordInput("");
    setOpen(false);
  };

  const isValid = tagName.trim() && description.trim() && keywords.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-ai-primary" />
            Vytvoriť nový AI tag
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tag Name */}
          <div className="space-y-2">
            <Label htmlFor="tagName">Názov tagu</Label>
            <Input
              id="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Zadajte názov tagu"
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Popíšte účel tohto tagu a kedy sa má použiť"
              maxLength={200}
              rows={3}
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>Ikona</Label>
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte ikonu" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <Label>Kľúčové slová pre AI rozpoznávanie</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="deadline, urgentné, dôležité..."
                />
                <Button 
                  type="button" 
                  onClick={addKeyword}
                  disabled={!keywordInput.trim() || keywords.includes(keywordInput.trim())}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Keywords Display */}
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-muted/30">
                {keywords.length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    Pridajte kľúčové slová, ktoré pomôžu AI rozpoznať tento tag
                  </span>
                ) : (
                  keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                AI bude hľadať tieto slová v emailoch na automatické označenie
              </p>
            </div>
          </div>

          {/* AI Training Preview */}
          <div className="p-4 bg-ai-primary-light border border-ai-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-ai-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">AI</span>
              </div>
              <span className="text-sm font-medium">Náhľad tagu</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {iconOptions.find(opt => opt.value === selectedIcon)?.icon || "🏷️"}
                </span>
                <span className="font-medium">{tagName || "Názov tagu"}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {description || "Popis tagu"}
              </p>
              {keywords.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Kľúčové slová: {keywords.join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Zrušiť
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isValid}
              className="bg-ai-primary hover:bg-ai-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Vytvoriť tag
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};