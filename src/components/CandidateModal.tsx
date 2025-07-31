// components/CandidateModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CandidateModalProps {
  open: boolean;
  onClose: () => void;
  candidate: {
    name: string;
    score: number;
    text: string;
    explanation: string;
  } | null;
}

export default function CandidateModal({ open, onClose, candidate }: CandidateModalProps) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden dark:text-zinc-100">
        <DialogHeader>
          <DialogTitle>{candidate.name}</DialogTitle>
          <DialogDescription>Score: {candidate.score}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <p className="mb-4 text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">Explanation: </span>
            {candidate.explanation}
          </p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
