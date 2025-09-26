import { useState } from 'react';
import Header from '../Header';

export default function HeaderExample() {
  const [credits, setCredits] = useState(25);
  
  return (
    <div className="space-y-8">
      <Header 
        credits={credits}
        onCreditsUpdate={setCredits}
      />
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Current credits: {credits}
        </p>
      </div>
    </div>
  );
}