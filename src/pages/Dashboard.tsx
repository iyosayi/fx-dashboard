import { DollarSign, Activity, Repeat } from 'lucide-react';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';
import StatsCard from '@/components/Dashboard/StatsCard';
import ConversionWidget from '@/components/Dashboard/ConversionWidget';
import TransactionsList from '@/components/Dashboard/TransactionsList';
import AnalyticsChart from '@/components/Dashboard/AnalyticsChart';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="p-4 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Converted"
              value="$45,280"
              change={12.5}
              icon={DollarSign}
              data={[20, 35, 28, 42, 38, 45, 52]}
            />
            <StatsCard
              title="Total Transactions"
              value="156"
              change={8.2}
              icon={Activity}
              data={[15, 22, 18, 28, 25, 30, 35]}
            />
            <StatsCard
              title="Most Converted"
              value="USD → NGN"
              change={-3.1}
              icon={Repeat}
              data={[30, 28, 32, 27, 25, 22, 24]}
            />
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
