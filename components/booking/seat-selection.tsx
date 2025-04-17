'use client';

import { useState } from 'react';
import { Seat } from '@/lib/types/booking';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SeatSelectionProps {
  seats: Seat[];
  onSeatSelect: (selectedSeats: Seat[]) => void;
  maxSeats?: number;
}

export function SeatSelection({ 
  seats, 
  onSeatSelect, 
  maxSeats = 10 
}: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= maxSeats) return prev;
      return [...prev, seat];
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'taken') return 'bg-muted text-muted-foreground cursor-not-allowed';
    if (selectedSeats.find((s) => s.id === seat.id)) return 'bg-primary text-primary-foreground';
    return 'bg-secondary hover:bg-secondary/80';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded" />
          <span>Taken</span>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
        {seats.map((seat) => (
          <Button
            key={seat.id}
            variant="secondary"
            className={cn(
              'w-8 h-8 p-0 font-mono text-xs',
              getSeatColor(seat)
            )}
            onClick={() => handleSeatClick(seat)}
            disabled={seat.status === 'taken'}
          >
            {seat.row}{seat.number}
          </Button>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Selected: {selectedSeats.length} seats
        </p>
        <Button 
          onClick={() => onSeatSelect(selectedSeats)}
          disabled={selectedSeats.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}