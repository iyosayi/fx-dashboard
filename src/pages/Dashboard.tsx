import { useState } from 'react';
import { DollarSign, Activity, Repeat } from 'lucide-react';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';
import StatsCard from '@/components/Dashboard/StatsCard';
import ConversionWidget from '@/components/Dashboard/ConversionWidget';
import TransactionsList from '@/components/Dashboard/TransactionsList';
import AnalyticsChart from '@/components/Dashboard/AnalyticsChart';
import { useDashboardStats } from '@/hooks/api/useDashboardStats';
import { formatCurrency } from '@/lib/utils';
import { StatData } from '@/lib/api/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useDashboardStats({ days: 7 });
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  // Get available currencies
  const availableCurrencies = stats?.totalConverted 
    ? Object.keys(stats.totalConverted).sort() 
    : [];

  // Get the primary currency (largest value) from totalConverted
  const getPrimaryCurrency = (): { currency: string; data: StatData } | null => {
    if (!stats?.totalConverted) return null;

    const currencies = Object.entries(stats.totalConverted);
    if (currencies.length === 0) return null;

    // Find currency with highest value
    const [currency, data] = currencies.reduce((max, curr) =>
      curr[1].value > max[1].value ? curr : max
    );

    return { currency, data };
  };

  const primaryCurrency = getPrimaryCurrency();

  // Determine which currency to display
  const displayCurrency = (() => {
    if (!stats?.totalConverted) return null;
    
    // Use selected currency if available
    if (selectedCurrency && stats.totalConverted[selectedCurrency]) {
      return { currency: selectedCurrency, data: stats.totalConverted[selectedCurrency] };
    }
    
    // Fall back to primary currency
    return primaryCurrency;
  })();

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-4 space-y-6">
          {/* Currency Selector - Only show if multiple currencies available */}
          {availableCurrencies.length > 1 && (
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Display currency:</span>
                <Select
                  value={selectedCurrency || primaryCurrency?.currency || ''}
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              <>
                <div className="glass-card p-6 h-48 animate-pulse" />
                <div className="glass-card p-6 h-48 animate-pulse" />
                <div className="glass-card p-6 h-48 animate-pulse" />
              </>
            ) : isError ? (
              <div className="col-span-3 glass-card p-6 text-center text-muted-foreground">
                Failed to load dashboard statistics
              </div>
            ) : stats && displayCurrency ? (
              <>
                <StatsCard
                  title="Total Converted"
                  value={formatCurrency(displayCurrency.data.value, displayCurrency.currency)}
                  change={displayCurrency.data.change}
                  icon={DollarSign}
                  data={displayCurrency.data.trendData}
                />
                <StatsCard
                  title="Total Transactions"
                  value={stats.totalTransactions.value.toString()}
                  change={stats.totalTransactions.change}
                  icon={Activity}
                  data={stats.totalTransactions.trendData}
                />
                <StatsCard
                  title="Most Converted"
                  value={`${stats.mostConverted.fromCurrency} → ${stats.mostConverted.toCurrency}`}
                  change={stats.mostConverted.change}
                  icon={Repeat}
                  data={stats.mostConverted.trendData}
                />
              </>
            ) : null}
          </div>

          {/* Conversion Widget & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <ConversionWidget />
            </div>
            <div className="lg:col-span-2">
              <TransactionsList />
            </div>
          </div>

          {/* Analytics Chart */}
          <AnalyticsChart />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
