import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Coins, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  savings?: string;
  icon: React.ElementType;
};

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 5,
    icon: Coins,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 25,
    price: 10,
    popular: true,
    savings: '20%',
    icon: Zap,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    credits: 60,
    price: 20,
    savings: '33%',
    icon: Star,
  },
];

interface CreditPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onPurchase: (packageId: string) => void;
  currentCredits: number;
}

export default function CreditPurchaseModal({ 
  open, 
  onClose, 
  onPurchase, 
  currentCredits 
}: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('popular');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePurchase = async () => {
    console.log(`Purchasing package: ${selectedPackage}`);
    setIsProcessing(true);
    
    try {
      await onPurchase(selectedPackage);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Purchase Credits
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose a credit package to continue generating amazing content.
            <br />
            You currently have <strong>{currentCredits}</strong> credits.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Credit Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CREDIT_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              const Icon = pkg.icon;
              
              return (
                <Card
                  key={pkg.id}
                  className={cn(
                    "relative p-6 cursor-pointer transition-all hover-elevate border",
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "hover:border-primary/50",
                    pkg.popular && "border-primary/30"
                  )}
                  onClick={() => {
                    console.log(`Selected package: ${pkg.name}`);
                    setSelectedPackage(pkg.id);
                  }}
                  data-testid={`card-package-${pkg.id}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  {isSelected && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
                  )}
                  
                  <div className="space-y-4 text-center">
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-lg flex items-center justify-center",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-card-foreground">{pkg.name}</h3>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-primary">
                          ${pkg.price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.credits} credits
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        ${(pkg.price / pkg.credits).toFixed(2)} per credit
                      </p>
                      
                      {pkg.savings && (
                        <Badge variant="secondary" className="text-xs">
                          Save {pkg.savings}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {/* Purchase Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Credits never expire</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Secure payment via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Instant credit delivery</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="button-cancel-purchase"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="flex-1"
              data-testid="button-confirm-purchase"
            >
              {isProcessing ? 'Processing...' : `Purchase ${CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.credits} Credits`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}