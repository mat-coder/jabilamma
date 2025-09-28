import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onGenerate: () => void;
  canGenerate: boolean;
  creditsAvailable: boolean;
  isLoading?: boolean;
}

export default function GenerateButton({ onGenerate, canGenerate, creditsAvailable, isLoading = false }: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    if (!canGenerate || !creditsAvailable || isLoading) return;
    
    console.log('Starting content generation...');
    setIsGenerating(true);
    
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getButtonText = () => {
    if (isGenerating || isLoading) return 'Generating...';
    if (!creditsAvailable) return 'No Credits Available';
    if (!canGenerate) return 'Complete Setup First';
    return 'Generate Content';
  };
  
  const isDisabled = !canGenerate || !creditsAvailable || isGenerating || isLoading;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Button
        size="lg"
        onClick={handleGenerate}
        disabled={isDisabled}
        className={cn(
          "group px-8 py-4 text-lg font-semibold min-w-[200px]",
          "transition-all duration-300 ease-in-out",
          "hover:scale-105 active:scale-95",
          "shadow-lg hover:shadow-xl",
          isDisabled && "opacity-50 cursor-not-allowed hover:scale-100"
        )}
        data-testid="button-generate"
      >
        <div className="flex items-center gap-2 transition-all duration-200">
          {isGenerating || isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
          )}
          <span className="transition-all duration-200">
            {getButtonText()}
          </span>
        </div>
      </Button>
      
      {!creditsAvailable && (
        <p className="text-sm text-destructive text-center">
          Purchase credits to generate content
        </p>
      )}
      
      {creditsAvailable && !canGenerate && (
        <p className="text-sm text-muted-foreground text-center">
          Please select language and content type to continue
        </p>
      )}
      
      {canGenerate && creditsAvailable && (
        <p className="text-xs text-muted-foreground text-center">
          Each generation uses 1 credit
        </p>
      )}
    </div>
  );
}
