// src/app/on-this-day/page.tsx

export const revalidate = 3600; // Revalidate every hour

import { fetchApod, isApodError, type ApodData } from '@/lib/nasa-apod';
import { format, getYear, getMonth, getDate } from 'date-fns';
import OnThisDayCard from '@/components/on-this-day-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default async function OnThisDayPage() {
  const today = new Date();
  const currentYear = getYear(today);
  const month = getMonth(today) + 1;
  const day = getDate(today);

  const datesToFetch: string[] = [];
  const startYear = Math.max(1996, getYear(new Date('1995-06-20')));

  for (let year = currentYear - 1; year >= startYear; year--) {
    if (year === 1995 && (month < 6 || (month === 6 && day < 20))) continue;
    datesToFetch.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }

  const apodResults: ApodData[] = [];
  let failedCount = 0;

  for (const date of datesToFetch) {
    const result = await fetchApod(date);
    if (!isApodError(result)) {
      apodResults.push(result);
    } else {
      failedCount++;
    }
    await new Promise(res => setTimeout(res, 300)); // throttle to avoid API overload
  }

  const sortedApods = apodResults.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="my-12 text-center">
        <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
          On This Day in History
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          A look back at astronomy pictures from {format(today, 'MMMM do')} through the years.
        </p>
      </header>

      <main>
        {failedCount > 0 && (
          <Alert className="mb-6 bg-yellow-100 border-yellow-300 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Some entries failed to load</AlertTitle>
            <AlertDescription>
              {failedCount} of {datesToFetch.length} APOD entries could not be retrieved.
            </AlertDescription>
          </Alert>
        )}

        {sortedApods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedApods.map(apod => (
              <OnThisDayCard key={apod.date} apod={apod} />
            ))}
          </div>
        ) : (
          <Alert className="max-w-xl mx-auto bg-secondary/30 border-primary/20">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">No Pictures Found</AlertTitle>
            <AlertDescription>
              It looks like there are no historical pictures for this date. This could be because it's a leap day or there wasn't a picture published on this day in the past.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
