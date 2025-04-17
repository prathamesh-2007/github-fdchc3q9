'use client';

import { Theater } from '@/lib/types/booking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

interface TheaterListProps {
  theaters: Theater[];
  onSelectShowTime: (theaterId: string, showTimeId: string) => void;
}

export function TheaterList({ theaters, onSelectShowTime }: TheaterListProps) {
  return (
    <div className="space-y-4">
      {theaters.map((theater) => (
        <Card key={theater.id} className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{theater.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {theater.location}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {theater.showTimes.map((showTime) => (
                <Button
                  key={showTime.id}
                  variant="outline"
                  className="flex items-center space-x-2"
                  onClick={() => onSelectShowTime(theater.id, showTime.id)}
                  disabled={showTime.seatsAvailable === 0}
                >
                  <Clock className="h-4 w-4" />
                  <span>{showTime.time}</span>
                  <span className="text-sm text-muted-foreground">
                    (₹{showTime.price})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}