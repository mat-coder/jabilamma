import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreditPurchaseModal from '../CreditPurchaseModal';

export default function CreditPurchaseModalExample() {
  const [open, setOpen] = useState(false);
  
  const handlePurchase = (packageId: string) => {
    console.log('Demo purchase:', packageId);
    return Promise.resolve();
  };
  
  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Credit Purchase Modal</Button>
      
      <CreditPurchaseModal 
        open={open}
        onClose={() => setOpen(false)}
        onPurchase={handlePurchase}
        currentCredits={5}
      />
    </div>
  );
}