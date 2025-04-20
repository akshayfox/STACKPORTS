import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, SwitchCamera } from 'lucide-react';

// Conversion factor: approximately 3.7795275591 pixels per mm at 96 DPI
const PX_PER_MM = 3.7795275591;

export interface NewDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (width: number, height: number) => void; // Always submits in pixels
  initialWidth?: number; // In pixels
  initialHeight?: number; // In pixels
}

type Unit = 'px' | 'mm';

export function NewDesignDialog({
  open,
  onOpenChange,
  onSubmit,
  initialWidth = 235,
  initialHeight = 400,
}: NewDesignDialogProps) {
  const [unit, setUnit] = React.useState<Unit>('px');
  
  // Always store internal values in pixels
  const [pixelWidth, setPixelWidth] = React.useState(initialWidth);
  const [pixelHeight, setPixelHeight] = React.useState(initialHeight);
  
  // Displayed values based on selected unit
  const displayWidth = unit === 'px' 
    ? Math.round(pixelWidth) 
    : Math.round((pixelWidth / PX_PER_MM) * 100) / 100;
    
  const displayHeight = unit === 'px' 
    ? Math.round(pixelHeight) 
    : Math.round((pixelHeight / PX_PER_MM) * 100) / 100;

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (unit === 'px') {
      setPixelWidth(value);
    } else {
      setPixelWidth(value * PX_PER_MM);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (unit === 'px') {
      setPixelHeight(value);
    } else {
      setPixelHeight(value * PX_PER_MM);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'px' ? 'mm' : 'px');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always submit in pixels
    onSubmit(Math.round(pixelWidth), Math.round(pixelHeight));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl shadow-lg border-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-blue-500" />
            New Design
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Set the dimensions for your new design canvas.
          </DialogDescription>
        </DialogHeader>

        

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            
          <div className="flex justify-between mb-2 ">
          <div className="text-xs text-gray-400">
              Canvas size: {Math.round(pixelWidth)} × {Math.round(pixelHeight)}px
              {unit === 'mm' && ` (${displayWidth} × ${displayHeight}mm)`}
            </div>
            <button
              type="button"
              onClick={toggleUnit}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <SwitchCamera className="h-4 w-4" />
              Switch to {unit === 'px' ? 'mm' : 'px'}
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="width" className="text-right text-sm font-medium">
                Width ({unit})
              </label>
              <div className="col-span-3 relative">
                <input
                  id="width"
                  type="number"
                  min="1"
                  step={unit === 'mm' ? '0.01' : '1'}
                  value={displayWidth}
                  onChange={handleWidthChange}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="height" className="text-right text-sm font-medium">
                Height ({unit})
              </label>
              <div className="col-span-3 relative">
                <input
                  id="height"
                  type="number"
                  min="1"
                  step={unit === 'mm' ? '0.01' : '1'}
                  value={displayHeight}
                  onChange={handleHeightChange}
                  className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center pt-2">
          
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Create Design
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}