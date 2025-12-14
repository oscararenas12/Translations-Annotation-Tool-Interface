import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { TranslationCard } from './components/TranslationCard';
import { StandardCard } from './components/StandardCard';
import { AnnotationSection } from './components/AnnotationSection';
import sampleData from '../data/english_ngss_evaluation.json';

// Matched standard from the real data
export interface MatchedStandard {
  standard_code: string;
  description: string;
  academic_subject: string;
  grade_levels: string[];
  jurisdiction: string;
  similarity_score: number;
}

// Translation record matching the actual data structure
export interface TranslationRecord {
  id: string;
  english_text: string;
  textbook_grade: string;
  target_grade: string;
  target_age: string;
  domain: string;
  subject: string;
  spanish_translation: string;
  valid_translation: boolean;
  validation_reason: string;
  tokens: number;
  attempts: number;
  success: boolean;
  final_status: string;
  flesh_grade: number;
  fernandez_huerta_score: number;
  fernandez_huerta_grade: number;
  fernandez_huerta_age: string;
  model: string;
  NGSS_matched_standards: MatchedStandard[];
}

// Type the imported data
const data = sampleData as TranslationRecord[];

export default function App() {
  const [darkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const samplesPerPage = 3;
  const totalPages = Math.ceil(data.length / samplesPerPage);
  const startIndex = currentPage * samplesPerPage;
  const currentSamples = data.slice(startIndex, startIndex + samplesPerPage);

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (currentSamples.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-900 dark:text-white">No data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header Bar */}
        <header className="border-b bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-gray-900 dark:text-white">Translation Review — Annotation Tool</h1>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Page Counter */}
                <Badge variant="secondary">
                  Page {currentPage + 1} of {totalPages} ({data.length} samples)
                </Badge>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="px-6"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleNext}
                    disabled={currentPage === totalPages - 1}
                    className="px-6"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - 3 Samples Per Page (Row-Based Grid) */}
        <main className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Row 1: Sample Headers */}
            {currentSamples.map((_, i) => (
              <div key={`header-${i}`} className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sample {startIndex + i + 1}
              </div>
            ))}

            {/* Row 2: Translation Cards */}
            {currentSamples.map((sample, i) => (
              <div key={`trans-${i}`} className="h-[400px]">
                <TranslationCard translation={sample} />
              </div>
            ))}

            {/* Row 3: NGSS Standards */}
            {currentSamples.map((sample, i) => (
              <div key={`std-${i}`} className="h-[200px] flex flex-col">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0 h-5">
                  {i === 0 && 'NGSS Standards for English text'}
                </div>
                <div className="flex-1 min-h-0">
                  <StandardCard standards={sample.NGSS_matched_standards} />
                </div>
              </div>
            ))}

            {/* Row 4: Annotations */}
            {currentSamples.map((sample, i) => (
              <div key={`anno-${i}`} className="h-[350px] flex flex-col">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0 h-5">
                  {i === 0 && 'Annotations'}
                </div>
                <div className="flex-1 min-h-0">
                  <AnnotationSection
                    translation={sample}
                    standards={sample.NGSS_matched_standards}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
