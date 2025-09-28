import { useState } from 'react';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import ContentTypeSelector from './ContentTypeSelector';
import ContextForm from './ContextForm';
import GenerateButton from './GenerateButton';
import GeneratedContent from './GeneratedContent';
import { useMutation, useQuery } from '@tanstack/react-query';

type ContentType = 'lyrics' | 'dialogue';

export default function ContentGenerator() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType | undefined>(undefined);
  const [context, setContext] = useState({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [user, setUser] = useState<any>({ id: 'demo-user', credits: 25 });
  const [credits, setCredits] = useState(25);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = Boolean(selectedLanguage && contentType);
  const creditsAvailable = credits > 0;

  const getLanguageName = (id: string) => {
    const names = {
      hindi: 'Hindi',
      tamil: 'Tamil',
      telugu: 'Telugu',
      bengali: 'Bengali',
      marathi: 'Marathi'
    };
    return names[id as keyof typeof names] || id;
  };

  // API call to generate content
  const generateMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          language: selectedLanguage,
          context,
          userId: user?.id || 'demo-user',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate content');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setCredits(data.creditsRemaining);
      // Update credits if user data is available
      if (user && data.creditsRemaining !== undefined) {
        setUser({ ...user, credits: data.creditsRemaining });
      }
    },
    onError: (error) => {
      console.error('Generation failed:', error);
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const handleGenerate = () => {
    if (!canGenerate) return;
    generateMutation.mutate();
  };

  const handleRegenerate = () => {
    setGeneratedContent('');
    generateMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        credits={credits}
        onCreditsUpdate={setCredits}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Language Selection */}
          <section>
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </section>
          
          {/* Content Type Selection */}
          {selectedLanguage && (
            <section>
              <ContentTypeSelector 
                selectedType={contentType}
                onTypeSelect={setContentType}
              />
            </section>
          )}
          
          {/* Context Form */}
          {selectedLanguage && contentType && (
            <section>
              <ContextForm 
                contentType={contentType}
                onContextChange={setContext}
              />
            </section>
          )}
          
          {/* Generate Button */}
          {selectedLanguage && contentType && (
            <section>
              <GenerateButton 
                canGenerate={canGenerate}
                creditsAvailable={creditsAvailable}
                isLoading={isGenerating}
                onGenerate={handleGenerate}
              />
            </section>
          )}
          
          {/* Generated Content */}
          <section>
            <GeneratedContent 
              content={generatedContent}
              language={getLanguageName(selectedLanguage)}
              contentType={contentType}
              isLoading={isGenerating}
              onRegenerate={handleRegenerate}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
