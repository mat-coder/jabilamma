import GeneratedContent from '../GeneratedContent';

const sampleLyrics = `तेरे इश्क में पागल हूँ मैं
दिल की धड़कन सुन रहा हूँ
हर सांस में तेरा नाम है
खुशियों का गीत गा रहा हूँ

सपनों में तू आता है
दिल को सुकून देता है
प्यार की ये कहानी
हमेशा याद रहेगी`;

const sampleDialogue = `पिता: "बेटा, जिंदगी में सफलता पाने के लिए मेहनत करनी पड़ती है।"
बेटा: "पापा, मैं समझ गया हूँ। अब से मैं पूरी लगन से पढ़ूंगा।"
पिता: "बस यही तो मैं सुनना चाहता था। तुम पर गर्व है मुझे।"
बेटा: "आपका साथ मिले तो कुछ भी असंभव नहीं।"`;

export default function GeneratedContentExample() {
  return (
    <div className="space-y-8">
      <GeneratedContent 
        content={sampleLyrics}
        language="Hindi"
        contentType="lyrics"
        onRegenerate={() => console.log('Regenerating lyrics')}
      />
      <GeneratedContent 
        content={sampleDialogue}
        language="Hindi"
        contentType="dialogue"
        onRegenerate={() => console.log('Regenerating dialogue')}
      />
      <GeneratedContent isLoading={true} />
      <GeneratedContent />
    </div>
  );
}