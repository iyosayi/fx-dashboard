import { Bell, Calendar } from 'lucide-react';

const Header = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="glass-card m-4 p-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full pulse-dot" />
        </button>
      </div>
    </header>
  );
};

export default Header;
