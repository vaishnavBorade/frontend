"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ Correct usage

interface Props {
  onResults: (results: any[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export default function UploadForm({ onResults, setLoading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLTextAreaElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const files = fileInputRef.current?.files;
    const jd = jdInputRef.current?.value;

    if (!jd || jd.trim() === "") {
      toast.error("Please enter a job description before submitting.");
      return;
    }

    if (!files || files.length === 0) {
      toast.error("Please upload at least one resume (PDF).");
      return;
    }

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }
    formData.append("job_description", jd);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rank`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onResults(data.results);

      toast.success("Resumes uploaded and processed successfully.");

      // Clear inputs
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (jdInputRef.current) jdInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`border-2 ${
          dragging ? "border-blue-500" : "border-dashed"
        } border-gray-300 rounded-md p-6 text-center bg-gray-50 dark:bg-zinc-800`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (fileInputRef.current) {
            fileInputRef.current.files = e.dataTransfer.files;
          }
        }}
      >
        <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
          Upload Resumes (PDF)
        </Label>
        <Input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Drag and drop PDFs here or click to browse.
        </p>
      </div>

      <div>
        <Label htmlFor="job-desc" className="block text-sm font-medium mb-2">
          Job Description
        </Label>
        <Textarea
          id="job-desc"
          ref={jdInputRef}
          rows={6}
          placeholder="Paste job description here..."
        />
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
