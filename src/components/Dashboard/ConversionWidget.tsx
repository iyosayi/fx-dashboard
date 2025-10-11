import { useState, useEffect } from 'react';
import { ArrowLeftRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const currencies = [
  { code: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'NGN', symbol: '₦', flag: '🇳🇬' },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦' },
];

const mockRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, NGN: 1650, JPY: 149.50, CAD: 1.36 },
  EUR: { USD: 1.09, GBP: 0.86, NGN: 1795, JPY: 162.50, CAD: 1.48 },
  GBP: { USD: 1.27, EUR: 1.16, NGN: 2095, JPY: 189.50, CAD: 1.72 },
  NGN: { USD: 0.00061, EUR: 0.00056, GBP: 0.00048, JPY: 0.091, CAD: 0.00082 },
  JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, NGN: 11.03, CAD: 0.0091 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, NGN: 1213, JPY: 110.50 },
};

const ConversionWidget = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('NGN');
  const [amount, setAmount] = useState('1000');
  const [isConverting, setIsConverting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rate, setRate] = useState(1650);

  useEffect(() => {
    if (fromCurrency !== toCurrency) {
      const newRate = mockRates[fromCurrency]?.[toCurrency] || 1;
      setRate(newRate);
    }
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = async () => {
    setIsConverting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConverting(false);
    setShowSuccess(true);
    toast.success('Conversion successful!', {
      description: `Converted ${amount} ${fromCurrency} to ${toCurrency}`,
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);
  const convertedAmount = parseFloat(amount || '0') * rate;

  return (
    <div className="glass-card p-8">
      <h3 className="text-xl font-bold mb-6">Convert Currency</h3>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">To</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <button
            onClick={handleSwap}
            className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-all hover:rotate-180 duration-300"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {fromCurrencyData?.symbol}
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-white/10 pl-12 text-2xl font-semibold tabular-nums"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Rate</span>
            <span className="font-medium tabular-nums">
              1 {fromCurrency} = {rate.toLocaleString()} {toCurrency}
              <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full pulse-dot" />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">You'll receive</span>
            <span className="text-2xl font-bold text-accent tabular-nums">
              {toCurrencyData?.symbol} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={isConverting || showSuccess}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[0_0_40px_hsl(243,75%,59%,0.3)] transition-all duration-300"
        >
          {isConverting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Converting...
            </span>
          ) : showSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Success!
            </span>
          ) : (
            'Convert Now'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConversionWidget;
