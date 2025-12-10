import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Standard {
  id: string;
  description: string;
}

interface StandardCardProps {
  standard: Standard;
}

export function StandardCard({ standard }: StandardCardProps) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3 bg-purple-50 dark:bg-purple-950/30">
        <CardTitle className="text-base">{standard.id}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {standard.description}
        </p>
      </CardContent>
    </Card>
  );
}
