import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  const selectedLangObj = LANGUAGES.find(lang => lang.id === selectedLanguage);
  
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Choose Your Language</h2>
        <p className="text-muted-foreground">Select the Indian language for your content generation</p>
      </div>
      
      <div className="max-w-md mx-auto space-y-3">
        <Label className="text-sm font-medium">Language</Label>
        <Select
          value={selectedLanguage}
          onValueChange={(value) => {
            console.log(`Selected language: ${LANGUAGES.find(lang => lang.id === value)?.name}`);
            onLanguageSelect(value);
          }}
        >
          <SelectTrigger className="w-full" data-testid="select-language">
            <SelectValue placeholder="Select a language">
              {selectedLangObj && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">{selectedLangObj.name}</span>
                  <span className="text-primary font-medium">{selectedLangObj.nativeName}</span>
                  <span className="text-muted-foreground text-sm">({selectedLangObj.description})</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((language) => (
              <SelectItem 
                key={language.id} 
                value={language.id}
                data-testid={`option-language-${language.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-primary font-medium">{language.nativeName}</span>
                  <span className="text-muted-foreground text-sm">({language.description})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}