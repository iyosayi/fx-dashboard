import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  data?: number[];
}

const StatsCard = ({ title, value, change, icon: Icon, data = [] }: StatsCardProps) => {
  const isPositive = change >= 0;
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div className="glass-card p-6 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>

      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold tabular-nums mb-4">{value}</p>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StatsCard;
