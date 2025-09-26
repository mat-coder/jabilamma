import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import CreditBalance from './CreditBalance';
import CreditPurchaseModal from './CreditPurchaseModal';

interface HeaderProps {
  credits?: number;
  onCreditsUpdate?: (newCredits: number) => void;
}

export default function Header({ credits = 25, onCreditsUpdate }: HeaderProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const handlePurchase = async (packageId: string) => {
    console.log('Processing purchase for package:', packageId);
    // TODO: Integrate with Stripe for real purchases
    // For demo, we'll simulate adding credits
    const creditsToAdd = {
      'starter': 10,
      'popular': 25,
      'premium': 60
    }[packageId] || 10;
    
    const newCredits = credits + creditsToAdd;
    onCreditsUpdate?.(newCredits);
    console.log(`Added ${creditsToAdd} credits. New total: ${newCredits}`);
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Palette className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">Song Lyrics & Dialog Generator</h1>
              <p className="text-xs text-muted-foreground">Multilingual Content Creator</p>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-4">
            <CreditBalance 
              credits={credits} 
              onPurchaseClick={() => setShowPurchaseModal(true)}
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <CreditPurchaseModal
        open={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={handlePurchase}
        currentCredits={credits}
      />
    </header>
  );
}