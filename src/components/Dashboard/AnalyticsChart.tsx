import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useConversionTimelineDays } from '@/hooks/api/useAnalytics';

const AnalyticsChart = () => {
  const { data: timelineData, isLoading, isError } = useConversionTimelineDays(7);

  // Transform API data for chart
  const chartData = timelineData?.timeline.map((item) => {
    const date = new Date(item.timestamp);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      name: dayName,
      value: item.totalAmount,
      count: item.conversionCount,
    };
  }) || [];

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Conversion Trends</h3>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </div>
      
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Failed to load analytics data
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data available for the selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AnalyticsChart;
