import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, Lock, CloudUpload, Loader2, Check } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { TranslationCard } from './components/TranslationCard';
import { StandardCard } from './components/StandardCard';
import { AnnotationSection } from './components/AnnotationSection';
import sampleData from '../data/english_evaluation_sample.json';

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

// Annotation interfaces
export interface TranslationAnnotation {
  rating: 'Worst' | 'Middle' | 'Best' | null;
  comment: string;
  annotated_at: string | null;
}

export interface StandardAlignmentAnnotation {
  standard_code: string;
  rating: 'Worst' | 'Middle' | 'Best' | null;
  comment: string;
  annotated_at: string | null;
}

export interface Annotations {
  spanish_translation_quality: TranslationAnnotation;
  standards_alignment: StandardAlignmentAnnotation[];
}

// Global state: Map of sample ID -> Annotations
type AnnotationsMap = Record<string, Annotations>;

// localStorage keys
const STORAGE_KEY = 'translation-annotations';
const AUTH_KEY = 'translation-tool-auth';
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || '';

// Load annotations from localStorage
const loadAnnotations = (): AnnotationsMap => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Save annotations to localStorage
const saveAnnotations = (annotations: AnnotationsMap) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
};

// Annotation status type
export type AnnotationStatus = 'not-started' | 'partial' | 'done';

// Get annotation status for a sample
const getAnnotationStatus = (annotations: Annotations | undefined, standardsCount: number): AnnotationStatus => {
  if (!annotations) return 'not-started';

  const hasTranslationRating = annotations.spanish_translation_quality?.rating !== null;
  const standardRatings = annotations.standards_alignment?.filter(s => s.rating !== null).length || 0;
  const totalRequired = 1 + standardsCount; // 1 translation + N standards
  const totalCompleted = (hasTranslationRating ? 1 : 0) + standardRatings;

  if (totalCompleted === 0) return 'not-started';
  if (totalCompleted === totalRequired) return 'done';
  return 'partial';
};

// Status badge component
const StatusBadge = ({ status }: { status: AnnotationStatus }) => {
  const styles: Record<AnnotationStatus, React.CSSProperties> = {
    'not-started': { backgroundColor: '#e5e7eb', color: '#4b5563' },
    'partial': { backgroundColor: '#fef08a', color: '#854d0e' },
    'done': { backgroundColor: '#bbf7d0', color: '#166534' }
  };
  const labels = {
    'not-started': 'Not Started',
    'partial': 'Partial',
    'done': 'Done'
  };
  return (
    <Badge className="text-xs" style={styles[status]}>
      {labels[status]}
    </Badge>
  );
};

// Type the imported data
const data = sampleData as TranslationRecord[];

// Extract numeric grade value for sorting (e.g., "2nd-3rd" -> 2, "5th" -> 5)
const getGradeNumber = (grade: string): number => {
  const match = grade.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Sort data by target grade (ascending)
const sortedData = [...data].sort((a, b) =>
  getGradeNumber(a.target_grade) - getGradeNumber(b.target_grade)
);

export default function App() {
  const [darkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [annotations, setAnnotations] = useState<AnnotationsMap>(loadAnnotations);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Handle login
  const handleLogin = () => {
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // Load from Supabase if localStorage is empty (recover after cache clear)
  useEffect(() => {
    const loadFromSupabase = async () => {
      // Only load from Supabase if localStorage is empty
      if (Object.keys(annotations).length > 0) return;

      try {
        const { data, error } = await supabase.storage
          .from('annotations')
          .download('annotated_data.json');

        if (error || !data) return;

        const text = await data.text();
        const savedData = JSON.parse(text);

        // Extract annotations from the saved data
        const recoveredAnnotations: AnnotationsMap = {};
        savedData.forEach((record: { id: string; annotations: Annotations | null }) => {
          if (record.annotations) {
            recoveredAnnotations[record.id] = record.annotations;
          }
        });

        if (Object.keys(recoveredAnnotations).length > 0) {
          setAnnotations(recoveredAnnotations);
          console.log('Recovered annotations from Supabase');
        }
      } catch (error) {
        console.error('Failed to load from Supabase:', error);
      }
    };

    loadFromSupabase();
  }, []);

  // Auto-save annotations to localStorage
  useEffect(() => {
    saveAnnotations(annotations);
  }, [annotations]);

  // Auto-save to Supabase (debounced - 3 seconds after last change)
  useEffect(() => {
    // Skip if no annotations yet
    if (Object.keys(annotations).length === 0) return;

    const timeoutId = setTimeout(async () => {
      setSaveStatus('saving');

      const annotatedData = sortedData.map(record => ({
        ...record,
        annotations: annotations[record.id] || null
      }));

      const jsonString = JSON.stringify(annotatedData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });

      try {
        const { error } = await supabase.storage
          .from('annotations')
          .upload('annotated_data.json', blob, {
            cacheControl: '0',
            upsert: true
          });

        if (error) throw error;
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [annotations]);

  // Update annotations for a specific sample
  const handleUpdateAnnotations = (sampleId: string, sampleAnnotations: Annotations) => {
    setAnnotations(prev => ({
      ...prev,
      [sampleId]: sampleAnnotations
    }));
  };

  // Count fully completed (done) samples
  const doneCount = sortedData.filter(record =>
    getAnnotationStatus(annotations[record.id], record.NGSS_matched_standards.length) === 'done'
  ).length;

  // Export annotated data as JSON
  const handleExport = () => {
    const annotatedData = sortedData.map(record => ({
      ...record,
      annotations: annotations[record.id] || null
    }));

    const blob = new Blob([JSON.stringify(annotatedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotated_english_evaluation_sample_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save progress to Supabase Storage
  const handleSaveProgress = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    // Prepare complete data with annotations
    const annotatedData = sortedData.map(record => ({
      ...record,
      annotations: annotations[record.id] || null
    }));

    const jsonString = JSON.stringify(annotatedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    try {
      const { error } = await supabase.storage
        .from('annotations')
        .upload('annotated_data.json', blob, {
          cacheControl: '0',
          upsert: true
        });

      if (error) throw error;

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
      alert('Failed to save to cloud. Your data is still saved locally.');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const samplesPerPage = 3;
  const totalPages = Math.ceil(sortedData.length / samplesPerPage);
  const startIndex = currentPage * samplesPerPage;
  const currentSamples = sortedData.slice(startIndex, startIndex + samplesPerPage);

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

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">Annotation Tool</h1>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
              className={passwordError ? 'border-red-500' : ''}
            />
            {passwordError && (
              <p className="text-red-500 text-xs">Incorrect password</p>
            )}
            <Button onClick={handleLogin} className="w-full" size="sm">
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                  Page {currentPage + 1} of {totalPages} ({sortedData.length} samples)
                </Badge>

                {/* Annotation Progress */}
                <Badge variant="outline" className="border-green-500 text-green-700">
                  Done: {doneCount} / {sortedData.length}
                </Badge>

                {/* Export Button */}
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>

                {/* Save Progress Button */}
                <Button
                  variant="default"
                  size="default"
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <CloudUpload className="h-4 w-4" />
                      Save Progress
                    </>
                  )}
                </Button>

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
            {currentSamples.map((sample, i) => {
              const status = getAnnotationStatus(annotations[sample.id], sample.NGSS_matched_standards.length);
              return (
                <div key={`header-${i}`} className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  Sample {startIndex + i + 1}
                  <StatusBadge status={status} />
                </div>
              );
            })}

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
            {currentSamples.map((sample, i) => {
              const status = getAnnotationStatus(annotations[sample.id], sample.NGSS_matched_standards.length);
              return (
                <div key={`anno-${i}`} className="h-[350px] flex flex-col">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex-shrink-0 h-5">
                    {i === 0 && 'Annotations'}
                  </div>
                  <div className="flex-1 min-h-0">
                    <AnnotationSection
                      translation={sample}
                      standards={sample.NGSS_matched_standards}
                      annotations={annotations[sample.id]}
                      onUpdateAnnotations={(newAnnotations) => handleUpdateAnnotations(sample.id, newAnnotations)}
                      status={status}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
