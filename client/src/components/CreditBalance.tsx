import { Coins, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreditBalanceProps {
  credits: number;
  onPurchaseClick?: () => void;
}

export default function CreditBalance({ credits, onPurchaseClick }: CreditBalanceProps) {
  const isLow = credits <= 5;
  const isEmpty = credits === 0;
  
  const getVariant = () => {
    if (isEmpty) return "destructive";
    if (isLow) return "secondary";
    return "default";
  };

  const handleClick = () => {
    console.log('Credit balance clicked');
    onPurchaseClick?.();
  };

  return (
    <Badge 
      variant={getVariant()}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium cursor-pointer hover-elevate",
        isEmpty && "text-destructive-foreground",
        isLow && !isEmpty && "text-yellow-600 dark:text-yellow-400"
      )}
      onClick={handleClick}
      data-testid="badge-credit-balance"
    >
      {isEmpty ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Coins className="h-4 w-4" />
      )}
      <span>
        {credits} {credits === 1 ? 'Credit' : 'Credits'}
      </span>
    </Badge>
  );
}