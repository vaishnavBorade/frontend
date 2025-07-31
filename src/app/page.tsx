"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UploadForm from "@/components/UploadForm";
import ResultsList from "@/components/ResultsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import CandidateModal from "@/components/CandidateModal";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  const handleFormSubmit = (newResults: any[]) => {
    setResults(newResults);
  };

  const handleExport = () => {
    const headers = ["Name", "Score", "Explanation"];
    const rows = results.map((r) => [r.name, r.score, r.explanation]);
    const csvContent = [headers, ...rows]
      .map((e) => e.map((s) => `"${String(s).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "resume_results.csv");
    link.click();
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    let y = 10;
  
    results.forEach((r, i) => {
      // Wrap long text
      const explanationLines = doc.splitTextToSize(`Explanation: ${r.explanation}`, 180);
      const resumeLines = doc.splitTextToSize(`Name: ${r.name}\nScore: ${r.score}`, 180);
  
      // Add content
      doc.text(resumeLines, 10, y);
      y += resumeLines.length * 10;
  
      doc.text(explanationLines, 10, y);
      y += explanationLines.length * 10 + 10;
  
      // Auto page break if needed
      if (y > 270 && i < results.length - 1) {
        doc.addPage();
        y = 10;
      }
    });
  
    doc.save("resume_results.pdf");
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6 sm:p-10">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
            AI Resume Screener
          </h1>

          <UploadForm onResults={handleFormSubmit} setLoading={setLoading} />

          {loading && (
            <div className="mt-6">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-4/5" />
              <p className="text-blue-500 mt-4">Processing resumes...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <Button onClick={handleExport} variant="outline">
                  Export CSV
                </Button>
                <Button onClick={handlePDFExport} variant="outline">
                  Export PDF
                </Button>
              </div>
              <ResultsList 
                results={results} 
                onCandidateClick={(candidate) => {
                  setSelectedCandidate(candidate);
                  setModalOpen(true);
                }}  
              />
              <CandidateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                candidate={selectedCandidate}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
