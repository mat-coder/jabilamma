import GenerateButton from '../GenerateButton';

export default function GenerateButtonExample() {
  const handleGenerate = () => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  };
  
  return (
    <div className="space-y-8">
      <GenerateButton 
        canGenerate={true}
        creditsAvailable={true}
        onGenerate={handleGenerate}
      />
      <GenerateButton 
        canGenerate={false}
        creditsAvailable={true}
        onGenerate={handleGenerate}
      />
      <GenerateButton 
        canGenerate={true}
        creditsAvailable={false}
        onGenerate={handleGenerate}
      />
    </div>
  );
}