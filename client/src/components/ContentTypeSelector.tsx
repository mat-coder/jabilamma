import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Music, Film } from "lucide-react";

type ContentType = 'lyrics' | 'dialogue';

const CONTENT_TYPES = [
  {
    id: 'lyrics' as ContentType,
    title: 'Song Lyrics',
    description: 'Generate beautiful, rhythmic song lyrics with emotions and melody',
    icon: Music,
    examples: ['Love songs', 'Folk tales', 'Devotional hymns']
  },
  {
    id: 'dialogue' as ContentType,
    title: 'Movie Dialogue',
    description: 'Create dramatic, authentic movie dialogues with character depth',
    icon: Film,
    examples: ['Action scenes', 'Romantic moments', 'Comedy sequences']
  },
];

interface ContentTypeSelectorProps {
  selectedType?: ContentType;
  onTypeSelect: (type: ContentType) => void;
}

export default function ContentTypeSelector({ selectedType, onTypeSelect }: ContentTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Content Type</h2>
        <p className="text-muted-foreground">What type of content would you like to generate?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTENT_TYPES.map((contentType) => {
          const isSelected = selectedType === contentType.id;
          const Icon = contentType.icon;
          
          return (
            <Card
              key={contentType.id}
              className={cn(
                "p-6 cursor-pointer transition-all hover-elevate border",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => {
                console.log(`Selected content type: ${contentType.title}`);
                onTypeSelect(contentType.id);
              }}
              data-testid={`card-content-${contentType.id}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-card-foreground">{contentType.title}</h3>
                </div>
                
                <p className="text-muted-foreground">{contentType.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-card-foreground">Popular themes:</p>
                  <div className="flex flex-wrap gap-2">
                    {contentType.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}