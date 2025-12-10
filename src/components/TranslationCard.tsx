import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface TranslationRecord {
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
}

interface TranslationCardProps {
  translation: TranslationRecord;
  index: number;
}

export function TranslationCard({ translation, index }: TranslationCardProps) {
  return (
    <Card className="flex flex-col h-full border-2">
      <CardHeader className="pb-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-3">
          <CardTitle className="text-lg">ID: {translation.id}</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Textbook: <span className="font-medium">{translation.textbook_grade}</span></span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Target Grade:</span>
                <Badge variant="default" className="text-sm px-3 py-1">
                  {translation.target_grade}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Domain: <span className="font-medium">{translation.domain}</span></span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Target Age:</span>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {translation.target_age} years
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col pt-4">
        {/* English Text */}
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            English (Source)
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-4 rounded-lg border max-h-52 overflow-y-auto leading-relaxed">
            {translation.english_text}
          </div>
        </div>

        {/* Spanish Translation */}
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Spanish (Translation)
          </div>
          <div className="text-base text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-900 max-h-52 overflow-y-auto leading-relaxed">
            {translation.spanish_translation}
          </div>
        </div>

        {/* Validation Warning */}
        {!translation.valid_translation && translation.validation_reason && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="text-xs text-red-700 dark:text-red-300">
              ⚠️ {translation.validation_reason}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="pt-3 border-t">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">FH Score</div>
              <div className="text-lg text-gray-900 dark:text-white">{translation.fernandez_huerta_score.toFixed(1)}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">FH Grade</div>
              <div className="text-lg text-gray-900 dark:text-white">{translation.fernandez_huerta_grade}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">FH Age</div>
              <div className="text-lg text-gray-900 dark:text-white">{translation.fernandez_huerta_age}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
