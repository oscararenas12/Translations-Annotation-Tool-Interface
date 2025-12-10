import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface Standard {
  id: string;
  description: string;
}

interface Translation {
  id: string;
  target_grade: string;
  target_age: string;
}

interface AnnotationSectionProps {
  translations: Translation[];
  standards: Standard[];
}

export function AnnotationSection({ translations, standards }: AnnotationSectionProps) {
  // Simple state for visual demo - ratings for each translation
  const [ratings, setRatings] = useState<number[]>(translations.map(() => 0));
  const [standardRatings, setStandardRatings] = useState<number[]>(translations.map(() => 0));

  const handleRating = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
  };

  const handleStandardRating = (index: number, rating: number) => {
    const newRatings = [...standardRatings];
    newRatings[index] = rating;
    setStandardRatings(newRatings);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg text-gray-900 dark:text-white">Annotation</h2>

      {/* Individual Annotation Cards for Each Translation */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {translations.map((translation, translationIndex) => (
          <Card key={translationIndex} className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3 bg-blue-50 dark:bg-blue-950/30">
              <CardTitle className="text-base">
                Translation Quality Rating
              </CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ID: {translation.id} — {translation.target_grade}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Translation Quality Rating */}
              <div>
                <div className="flex gap-2 mb-2 justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={ratings[translationIndex] === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRating(translationIndex, rating)}
                      className="flex-1 min-w-0"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Translation Notes */}
              <div>
                <Label className="mb-2 block text-sm">Notes:</Label>
                <Textarea
                  placeholder="Comments about this translation..."
                  rows={3}
                />
              </div>

              {/* Standard Rating - Only show the standard corresponding to this translation */}
              {standards[translationIndex] && (
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Standard Rating:</Label>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white mb-2">
                        {standards[translationIndex].id}
                      </div>
                      <div className="flex gap-2 justify-between">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant={standardRatings[translationIndex] === rating ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStandardRating(translationIndex, rating)}
                            className="flex-1 min-w-0"
                          >
                            {rating}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Notes */}
              <div>
                <Label className="mb-2 block text-sm">Notes:</Label>
                <Textarea
                  placeholder="Comments about standards alignment..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
