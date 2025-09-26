import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratedContentProps {
  content?: string;
  language?: string;
  contentType?: 'lyrics' | 'dialogue';
  onRegenerate?: () => void;
  isLoading?: boolean;
}

export default function GeneratedContent({ 
  content, 
  language, 
  contentType, 
  onRegenerate,
  isLoading = false 
}: GeneratedContentProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      console.log('Content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };
  
  const handleDownload = () => {
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType}-${language}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Content downloaded');
  };
  
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </Card>
    );
  }
  
  if (!content) {
    return (
      <Card className="p-12 text-center border-2 border-dashed">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Copy className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-card-foreground">Ready to Generate</h3>
            <p className="text-muted-foreground">
              Your generated content will appear here
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-card-foreground">Generated Content</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">{language}</Badge>
            <Badge variant="outline">
              {contentType === 'lyrics' ? 'Song Lyrics' : 'Movie Dialogue'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            data-testid="button-copy"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            data-testid="button-download"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Regenerating content...');
                onRegenerate();
              }}
              data-testid="button-regenerate"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <pre className={cn(
            "whitespace-pre-wrap font-sans text-card-foreground",
            "leading-relaxed text-base"
          )}>
            {content}
          </pre>
        </div>
      </div>
      
      {/* Footer actions */}
      <div className="px-6 py-4 bg-muted/30 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Generated {new Date().toLocaleTimeString()}</span>
          <span>1 credit used</span>
        </div>
      </div>
    </Card>
  );
}