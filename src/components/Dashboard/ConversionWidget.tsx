import { useState } from 'react';
import { ArrowLeftRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrencies, useConversionPreview } from '@/hooks/api/useRates';
import { useCreateConversion } from '@/hooks/api/useConversions';

const ConversionWidget = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('NGN');
  const [amount, setAmount] = useState('1000');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch currencies and conversion preview
  const { data: currencies = [], isLoading: loadingCurrencies } = useCurrencies();
  const { data: preview, isLoading: loadingPreview } = useConversionPreview(
    {
      from: fromCurrency,
      to: toCurrency,
      amount: parseFloat(amount) || 0,
    },
    { enabled: !!amount && parseFloat(amount) > 0 }
  );
  const createConversion = useCreateConversion();

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    await createConversion.mutateAsync({
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
    });
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);
  const convertedAmount = preview?.convertedAmount || 0;
  const rate = preview?.rate || 0;

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
            {loadingPreview ? (
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            ) : (
              <span className="font-medium tabular-nums">
                1 {fromCurrency} = {rate.toLocaleString()} {toCurrency}
                <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full pulse-dot" />
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">You'll receive</span>
            {loadingPreview ? (
              <div className="h-8 w-40 bg-muted animate-pulse rounded" />
            ) : (
              <span className="text-2xl font-bold text-accent tabular-nums">
                {toCurrencyData?.symbol} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleConvert}
          disabled={createConversion.isPending || showSuccess || loadingCurrencies || !amount || parseFloat(amount) <= 0}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[0_0_40px_hsl(243,75%,59%,0.3)] transition-all duration-300"
        >
          {createConversion.isPending ? (
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
