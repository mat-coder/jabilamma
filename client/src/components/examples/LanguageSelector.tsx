import { useState } from 'react';
import LanguageSelector from '../LanguageSelector';

export default function LanguageSelectorExample() {
  const [selected, setSelected] = useState<string>('hindi');
  
  return (
    <LanguageSelector 
      selectedLanguage={selected}
      onLanguageSelect={setSelected}
    />
  );
}