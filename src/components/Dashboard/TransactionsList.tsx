import { useState } from 'react';
import { ArrowRight, Download, Eye, ArrowUpDown, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useTransactions } from '@/hooks/api/useTransactions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TransactionStatus = 'completed' | 'pending' | 'failed';
type SortField = 'timestamp' | 'rate' | 'amountSent' | 'amountReceived';
type SortDirection = 'asc' | 'desc';

interface Transaction {
  id: number;
  from: string;
  to: string;
  amountSent: number;
  amountReceived: number;
  rate: number;
  timestamp: string;
  fullDate: string;
  status: TransactionStatus;
  _originalId?: string;
}

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const statusConfig = {
    completed: { 
      label: 'Completed', 
      variant: 'default' as const,
      icon: CheckCircle,
      className: 'bg-accent/20 text-accent border-accent/30 hover:bg-accent/30'
    },
    pending: { 
      label: 'Pending', 
      variant: 'secondary' as const,
      icon: Clock,
      className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30'
    },
    failed: { 
      label: 'Failed', 
      variant: 'destructive' as const,
      icon: XCircle,
      className: 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30'
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

const TransactionsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Fetch transactions from API
  const { data, isLoading, isError, error } = useTransactions({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortField,
    sortOrder: sortDirection,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const transactions = data?.transactions || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 0;

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', NGN: '₦', CAD: 'C$'
    };
    return symbols[currency] || currency;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading transactions...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Failed to load transactions</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-muted-foreground mb-2">
          <ArrowRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
        <p className="text-sm text-muted-foreground">Your conversion history will appear here</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Recent Transactions</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-secondary/30 border border-border rounded-md px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Timestamp
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Currency Pair</TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort('amountSent')}
                  className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                >
                  Amount Sent
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort('amountReceived')}
                  className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                >
                  Amount Received
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  onClick={() => handleSort('rate')}
                  className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                >
                  Rate
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:scale-[1.01] transition-transform"
                onClick={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
              >
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm">
                          <div className="font-medium">{transaction.timestamp}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{transaction.fullDate}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                      {transaction.from}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium">
                      {transaction.to}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {getCurrencySymbol(transaction.from)}{transaction.amountSent.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {getCurrencySymbol(transaction.to)}{transaction.amountReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {transaction.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('View details:', transaction.id);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View details</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Download receipt:', transaction.id);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download receipt</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-secondary/30 rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
            onClick={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                  {transaction.from}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium">
                  {transaction.to}
                </span>
              </div>
              <StatusBadge status={transaction.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <div className="text-muted-foreground text-xs">Sent</div>
                <div className="font-medium tabular-nums">
                  {getCurrencySymbol(transaction.from)}{transaction.amountSent.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs">Received</div>
                <div className="font-medium tabular-nums">
                  {getCurrencySymbol(transaction.to)}{transaction.amountReceived.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{transaction.timestamp}</span>
              <span>@ {transaction.rate.toLocaleString()}</span>
            </div>

            {expandedRow === transaction.id && (
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <PaginationEllipsis key={page} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
