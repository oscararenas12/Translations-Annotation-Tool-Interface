import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { MatchedStandard } from '../App';

interface StandardCardProps {
  standards: MatchedStandard[];
}

export function StandardCard({ standards }: StandardCardProps) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 h-full flex flex-col">
      <CardContent className="pt-3 space-y-4 flex-1 overflow-y-auto">
        {standards.map((standard, index) => (
            <div key={index} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
              {/* Standard Code & Badges */}
              <div className="space-y-2">
                <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  Standard Code: <Badge variant="default" className="text-xs">{standard.standard_code}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="secondary" className="text-xs">
                    Subject: {standard.academic_subject}
                  </Badge>
                  {standard.grade_levels.length > 0 && (
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Applicable Grades: Grade {standard.grade_levels.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {standard.description}
              </p>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
