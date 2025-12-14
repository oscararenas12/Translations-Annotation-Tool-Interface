import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { TranslationRecord } from '../App';

interface TranslationCardProps {
  translation: TranslationRecord;
}

export function TranslationCard({ translation }: TranslationCardProps) {
  return (
    <Card className="border-2 h-full flex flex-col">
      <CardHeader className="pb-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-3">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Domain: <span className="font-medium">{translation.domain}</span></span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Target Age:</span>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {translation.target_age} years
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Subject: <span className="font-medium">{translation.subject}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 flex-1 overflow-y-auto">
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
        <div>
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
              {translation.validation_reason}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
