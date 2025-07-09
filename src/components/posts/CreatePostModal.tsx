import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: (post: any) => void;
}

export function CreatePostModal({ open, onOpenChange, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleCreatePost = (postData: any) => {
    if (onPostCreated) {
      onPostCreated(postData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Título
            </Label>
            <Input id="name" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Conteúdo
            </Label>
            <Input id="username" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <Button onClick={() => handleCreatePost({ title, content })}>Criar Post</Button>
      </DialogContent>
    </Dialog>
  );
}
