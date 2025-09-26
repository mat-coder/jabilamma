import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

type Language = {
  id: string;
  name: string;
  nativeName: string;
  description: string;
};

const LANGUAGES: Language[] = [
  { id: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', description: 'Most widely spoken' },
  { id: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', description: 'Classical language' },
  { id: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', description: 'Melodious language' },
  { id: 'bengali', name: 'Bengali', nativeName: 'বাংলা', description: 'Language of literature' },
  { id: 'marathi', name: 'Marathi', nativeName: 'मराठी', description: 'Rich cultural heritage' },
];

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageSelect: (languageId: string) => void;
}

export default function LanguageSelector({ selectedLanguage, onLanguageSelect }: LanguageSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Choose Your Language</h2>
        <p className="text-muted-foreground">Select the Indian language for your content generation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LANGUAGES.map((language) => {
          const isSelected = selectedLanguage === language.id;
          
          return (
            <Card
              key={language.id}
              className={cn(
                "relative p-6 cursor-pointer transition-all hover-elevate border",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => {
                console.log(`Selected language: ${language.name}`);
                onLanguageSelect(language.id);
              }}
              data-testid={`card-language-${language.id}`}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
              )}
              
              <div className="space-y-3 text-center">
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground">{language.name}</h3>
                  <p className="text-2xl font-medium text-primary mt-1">{language.nativeName}</p>
                </div>
                <p className="text-sm text-muted-foreground">{language.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}