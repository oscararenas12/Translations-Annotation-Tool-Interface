import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import type { TranslationRecord, MatchedStandard, Annotations, AnnotationStatus } from '../App';

interface AnnotationSectionProps {
  translation: TranslationRecord;
  standards: MatchedStandard[];
  annotations?: Annotations;
  onUpdateAnnotations: (annotations: Annotations) => void;
  status: AnnotationStatus;
}

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

export function AnnotationSection({ translation, standards, annotations, onUpdateAnnotations, status }: AnnotationSectionProps) {
  // Initialize state from props or create default
  const createDefaultAnnotations = (): Annotations => ({
    spanish_translation_quality: {
      rating: null,
      comment: '',
      annotated_at: null
    },
    standards_alignment: standards.map(s => ({
      standard_code: s.standard_code,
      rating: null,
      comment: '',
      annotated_at: null
    }))
  });

  const [localAnnotations, setLocalAnnotations] = useState<Annotations>(
    annotations || createDefaultAnnotations()
  );

  // Sync with props when they change
  useEffect(() => {
    if (annotations) {
      setLocalAnnotations(annotations);
    } else {
      setLocalAnnotations(createDefaultAnnotations());
    }
  }, [translation.id]);

  // Update parent when local state changes
  const updateAndNotify = (newAnnotations: Annotations) => {
    setLocalAnnotations(newAnnotations);
    onUpdateAnnotations(newAnnotations);
  };

  const handleTranslationRating = (rating: 'Worst' | 'Middle' | 'Best') => {
    const updated: Annotations = {
      ...localAnnotations,
      spanish_translation_quality: {
        ...localAnnotations.spanish_translation_quality,
        rating,
        annotated_at: new Date().toISOString()
      }
    };
    updateAndNotify(updated);
  };

  const handleTranslationComment = (comment: string) => {
    const updated: Annotations = {
      ...localAnnotations,
      spanish_translation_quality: {
        ...localAnnotations.spanish_translation_quality,
        comment
      }
    };
    updateAndNotify(updated);
  };

  const handleStandardRating = (index: number, rating: 'Worst' | 'Middle' | 'Best') => {
    const newStandards = [...localAnnotations.standards_alignment];
    newStandards[index] = {
      ...newStandards[index],
      rating,
      annotated_at: new Date().toISOString()
    };
    const updated: Annotations = {
      ...localAnnotations,
      standards_alignment: newStandards
    };
    updateAndNotify(updated);
  };

  const handleStandardComment = (index: number, comment: string) => {
    const newStandards = [...localAnnotations.standards_alignment];
    newStandards[index] = {
      ...newStandards[index],
      comment
    };
    const updated: Annotations = {
      ...localAnnotations,
      standards_alignment: newStandards
    };
    updateAndNotify(updated);
  };

  const ratingOptions: ('Worst' | 'Middle' | 'Best')[] = ['Worst', 'Middle', 'Best'];

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 h-full flex flex-col">
      <CardHeader className="pb-3 bg-blue-50 dark:bg-blue-950/30">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">ID:</span>
            <Badge variant="default" className="text-sm px-3 py-1">{translation.id}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Target Grade:</span>
              <Badge variant="default" className="text-sm px-3 py-1">{translation.target_grade}</Badge>
            </div>
            <StatusBadge status={status} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 flex-1 overflow-y-auto">
        {/* Translation Quality */}
        <div className="space-y-2">
          <Label className="block text-sm font-medium">Spanish Translation Quality</Label>
          <div className="flex gap-2">
            {ratingOptions.map((option) => (
              <Button
                key={option}
                variant={localAnnotations.spanish_translation_quality.rating === option ? 'default' : 'secondary'}
                size="sm"
                onClick={() => handleTranslationRating(option)}
                className="flex-1"
                style={{ border: '1px solid #d1d5db' }}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Translation Comment - shows when rating is selected */}
        {localAnnotations.spanish_translation_quality.rating && (
          <div style={{ marginTop: '16px' }}>
            <Textarea
              placeholder="Add comment for translation quality..."
              rows={2}
              value={localAnnotations.spanish_translation_quality.comment}
              onChange={(e) => handleTranslationComment(e.target.value)}
              className="border-2 border-gray-300 dark:border-gray-600"
            />
          </div>
        )}

        {/* Standards Alignment */}
        <div className="space-y-2 border-t pt-4">
          <Label className="block text-sm font-medium">Standards Alignment</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {standards.map((standard, index) => (
              <div key={index} className="space-y-1">
                {/* Inline row: code + buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 dark:text-white w-[75px] flex-shrink-0 truncate" style={{ fontWeight: 600 }}>
                    {standard.standard_code}
                  </span>
                  <div className="flex gap-1 flex-1">
                    {ratingOptions.map((option) => (
                      <Button
                        key={option}
                        variant={localAnnotations.standards_alignment[index]?.rating === option ? 'default' : 'secondary'}
                        size="sm"
                        onClick={() => handleStandardRating(index, option)}
                        className="h-8 text-xs"
                        style={{
                          border: '1px solid #d1d5db',
                          flex: '1 1 0',
                          minWidth: 0
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Comment box appears when a rating is selected */}
                {localAnnotations.standards_alignment[index]?.rating && (
                  <div style={{ marginTop: '16px' }}>
                    <Textarea
                      placeholder="Add comment..."
                      rows={2}
                      value={localAnnotations.standards_alignment[index]?.comment || ''}
                      onChange={(e) => handleStandardComment(index, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
