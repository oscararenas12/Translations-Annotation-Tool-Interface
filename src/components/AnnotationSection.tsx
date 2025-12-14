import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import type { TranslationRecord, MatchedStandard } from '../App';

interface AnnotationSectionProps {
  translation: TranslationRecord;
  standards: MatchedStandard[];
}

export function AnnotationSection({ translation, standards }: AnnotationSectionProps) {
  const [translationRating, setTranslationRating] = useState<string | null>(null);
  const [standardRatings, setStandardRatings] = useState<(string | null)[]>(standards.map(() => null));

  const handleStandardRating = (index: number, rating: string) => {
    const newRatings = [...standardRatings];
    newRatings[index] = rating;
    setStandardRatings(newRatings);
  };

  const ratingOptions = ['Worst', 'Middle', 'Best'];

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 h-full flex flex-col">
      <CardHeader className="pb-3 bg-blue-50 dark:bg-blue-950/30">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">ID:</span>
            <Badge variant="default" className="text-sm px-3 py-1">{translation.id}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Target Grade:</span>
            <Badge variant="default" className="text-sm px-3 py-1">{translation.target_grade}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 flex-1 overflow-y-auto">
        {/* Translation Quality */}
        <div className="space-y-2">
          <Label className="block text-sm font-medium">Translation Quality</Label>
          <div className="flex gap-2">
            {ratingOptions.map((option) => (
              <Button
                key={option}
                variant={translationRating === option ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setTranslationRating(option)}
                className="flex-1"
                style={{ border: '1px solid #d1d5db' }}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <Textarea
            placeholder="Add comment..."
            rows={3}
            className="border-2 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Standards Alignment */}
        <div className="space-y-4 border-t pt-4">
          <Label className="block text-sm font-medium">Standards Alignment</Label>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {standards.map((standard, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xs text-gray-700 dark:text-gray-300">
                  {standard.standard_code}
                </div>
                <div className="flex gap-2">
                  {ratingOptions.map((option) => (
                    <Button
                      key={option}
                      variant={standardRatings[index] === option ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => handleStandardRating(index, option)}
                      className="flex-1"
                      style={{ border: '1px solid #d1d5db' }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="Add comment..."
                  rows={2}
                  className="border-2 border-gray-300 dark:border-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
