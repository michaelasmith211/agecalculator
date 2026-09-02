import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export default function AdSlot({ slotId = 'default-slot', format = 'horizontal', className = '' }: AdSlotProps) {
  const minHeightClass =
    format === 'horizontal'
      ? 'min-h-[90px] max-w-4xl'
      : format === 'rectangle'
      ? 'min-h-[250px] max-w-sm'
      : 'min-h-[120px] max-w-3xl';

  return (
    <div
      className={`my-8 mx-auto w-full flex flex-col items-center justify-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl p-4 text-center overflow-hidden ${minHeightClass} ${className}`}
      data-ad-slot={slotId}
      aria-label="Advertisement Space"
    >
      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1 select-none">
        Advertisement
      </span>
      <div className="text-xs text-slate-400 flex items-center justify-center">
        <span>Sponsor Placement Area</span>
      </div>
    </div>
  );
}
