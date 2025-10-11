import { ArrowRight } from 'lucide-react';

const mockTransactions = [
  { id: 1, from: 'USD', to: 'NGN', amount: 1000, rate: 1650, timestamp: '2 hours ago' },
  { id: 2, from: 'EUR', to: 'GBP', amount: 500, rate: 0.86, timestamp: '5 hours ago' },
  { id: 3, from: 'GBP', to: 'USD', amount: 750, rate: 1.27, timestamp: '1 day ago' },
  { id: 4, from: 'USD', to: 'JPY', amount: 2000, rate: 149.50, timestamp: '2 days ago' },
  { id: 5, from: 'CAD', to: 'USD', amount: 1500, rate: 0.74, timestamp: '3 days ago' },
];

const TransactionsList = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
      
      <div className="space-y-3">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">
                  {transaction.from}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full">
                  {transaction.to}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {transaction.timestamp}
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold tabular-nums">
                {transaction.amount.toLocaleString()} {transaction.from}
              </div>
              <div className="text-sm text-muted-foreground tabular-nums">
                @ {transaction.rate.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsList;
