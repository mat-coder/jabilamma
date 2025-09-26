import { useState } from 'react';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import ContextForm from './ContextForm';
import GenerateButton from './GenerateButton';
import GeneratedContent from './GeneratedContent';

// TODO: remove mock functionality - replace with real OpenAI integration
const MOCK_CONTENT = {
  lyrics: {
    hindi: `तेरे इश्क में पागल हूँ मैं
दिल की धड़कन सुन रहा हूँ
हर सांस में तेरा नाम है
खुशियों का गीत गा रहा हूँ

सपनों में तू आता है
दिल को सुकून देता है
प्यार की ये कहानी
हमेशा याद रहेगी`,
    tamil: `அழகிக பாடல்கள் உலகில்
இடைதலை பாடல்கள் விளையாடுதலில்
அன்பின் தெலுக் காலை வந்து
உன் வாழ்வில் இனிமை வந்து`,
    telugu: `నీ ప్రేమలో పాడిపోయాను
హృదయము గడగడ కొట్టుకున్నాను
మధుర వానిలో పాడాలను అనిపిస్తున్నది
సంగీతం లో జీవితం ఇది`,
    bengali: `তোমার ভালোবাসার গান
মনের অতলে বাজে সদা
ভালোবাসার এই গান গেয়ে
মন জুড়়িয়ে রাখে সদা`,
    marathi: `प्रेमाचे शब्द गात जातो
हृदयात वाजत वीणा एका
बसलेल्या स्मृतींचा माधुर्य
मनात प्रेमाचे उत्सव`
  },
  dialogue: {
    hindi: `पिता: "बेटा, जिंदगी में सफलता पाने के लिए मेहनत करनी पड़ती है।"
बेटा: "पापा, मैं समझ गया हूँ। अब से मैं पूरी लगन से पढ़ूंगा।"
पिता: "बस यही तो मैं सुनना चाहता था। तुम पर गर्व है मुझे।"`,
    tamil: `தந்தை: "மகனே, வாழ்க்கையில் வேலை ஸேய்யாதவன் ஆவானவன்தான்."
மகன்: "அப்பா, எனக்கு புரிஞ்சு விட்டது. இனி மேல் நான் கவனம் தருவேன்."
தந்தை: "இதுதான் எனக்கு கேக்கங்களா வேணும். நீங்க வேலை செய்வீங்க."`,
    telugu: `తాత: "కొడుకు, జీవితంలో విజయం సాధించాలంటే కష్టపడాలి."
కొడుకు: "నాన్నా, నేను అర్ధం చేసుకున్నాను. ఇక నుంచి గట్టిగా పరిశ్రమ చేస్తాను."
తాత: "ఇదే నేను వినాలని అనుకుంటున్నాను. నీ మీద గర్వం."`,
    bengali: `বাবা: "মা, জীবনে সফল হতে হলে কঠিন পরিশ্রম করতে হবে।"
মেয়ে: "বাবা, আমি বুঝতে পেরেছি। এবার থেকে আমি প্রাণপণে চেষ্টা করব।"
বাবা: "এটাই আমি শুনতে চেয়েছিলাম। তোমার জন্য গর্ব লাগছে।"`,
    marathi: `वडिल: "मुलगा, जीवनात यशस्वी मिळवायची असेल तर मेहनत करावी लागते."
मुलगा: "बाबा, मला समजले आहे. आता मी मनापासून अभ्यास करेन."
वडिल: "हेच तर मला ऐकायचे होते. तुझ्यावर मला गर्व वाटतो."`
  }
};

export default function ContentGenerator() {
  const [credits, setCredits] = useState(25);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [context, setContext] = useState({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canGenerate = Boolean(selectedLanguage);
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
  
  const handleGenerate = async () => {
    if (!canGenerate || !creditsAvailable) return;
    
    setIsGenerating(true);
    console.log('Generating content...', {
      language: selectedLanguage,
      context
    });
    
    try {
      // TODO: remove mock functionality - replace with real OpenAI API call
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      const mockContent = MOCK_CONTENT.lyrics[selectedLanguage as keyof typeof MOCK_CONTENT.lyrics];
      setGeneratedContent(mockContent || 'Content generated successfully!');
      setCredits(prev => prev - 1); // Deduct 1 credit
      
      console.log('Content generated successfully!');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRegenerate = () => {
    setGeneratedContent('');
    handleGenerate();
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
          
          {/* Context Form */}
          {selectedLanguage && (
            <section>
              <ContextForm 
                onContextChange={setContext}
              />
            </section>
          )}
          
          {/* Generate Button */}
          {selectedLanguage && (
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
              contentType="lyrics"
              isLoading={isGenerating}
              onRegenerate={handleRegenerate}
            />
          </section>
        </div>
      </main>
    </div>
  );
}