import { useState } from 'react';
import ContentTypeSelector from '../ContentTypeSelector';

type ContentType = 'lyrics' | 'dialogue';

export default function ContentTypeSelectorExample() {
  const [selected, setSelected] = useState<ContentType>('lyrics');
  
  return (
    <ContentTypeSelector 
      selectedType={selected}
      onTypeSelect={setSelected}
    />
  );
}