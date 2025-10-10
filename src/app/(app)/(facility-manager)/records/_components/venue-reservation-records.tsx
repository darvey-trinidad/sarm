'use client';
import type { VenueReservationReportError } from '@/types/api';
import { useState } from 'react';
import { Calendar, Download, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { BORROWING_STATUS_OPTIONS, type BorrowingStatus } from '@/constants/borrowing-status';
import { format } from 'date-fns';
import { cn, newDate } from '@/lib/utils';
import { api } from '@/trpc/react';

export default function VenueReservationRecords() {
  const [status, setStatus] = useState<BorrowingStatus | ''>('');
  const [venueId, setVenueId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: venueList } = api.venue.getAllVenues.useQuery();

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, string> = {};
      if (venueId) body.venueId = venueId;
      if (status) body.status = status;
      if (startDate) body.startDate = newDate(startDate).toISOString();
      if (endDate) body.endDate = newDate(endDate).toISOString();

      const response = await fetch('/api/reports/venue-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json() as VenueReservationReportError;
        throw new Error(errorData.error ?? 'Failed to generate report');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `venue-reservation-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setVenueId('');
    setStatus('');
    setStartDate(undefined);
    setEndDate(undefined);
    setError(null);
  };

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasFilters = venueId ?? status ?? startDate ?? endDate;

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Venues */}
          <Select
            value={venueId}
            onValueChange={(value) => setVenueId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select specific venue" />
            </SelectTrigger>
            <SelectContent>
              {venueList?.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as BorrowingStatus | '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {BORROWING_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                captionLayout="dropdown"
                disabled={(date) => date < new Date('1900-01-01')}
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                captionLayout="dropdown"
                disabled={(date) => date < new Date('1900-01-01')}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {status && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {BORROWING_STATUS_OPTIONS.find((s) => s.value === status)?.label}
              </Badge>
            )}
            {startDate && (
              <Badge variant="secondary" className="flex items-center gap-1">
                From: {format(startDate, 'PP')}
              </Badge>
            )}
            {endDate && (
              <Badge variant="secondary" className="flex items-center gap-1">
                To: {format(endDate, 'PP')}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}