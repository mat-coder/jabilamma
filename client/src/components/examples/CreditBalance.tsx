import CreditBalance from '../CreditBalance';

export default function CreditBalanceExample() {
  return (
    <div className="space-y-4">
      <CreditBalance credits={25} />
      <CreditBalance credits={5} />
      <CreditBalance credits={0} />
    </div>
  );
}