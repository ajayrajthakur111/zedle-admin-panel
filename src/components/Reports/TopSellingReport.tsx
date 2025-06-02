import React, {  useState } from 'react';
import { fetchTopSelling, type TopSellingRow } from '@/api/reportsService';
import {  CalendarDays, Search, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table, { type Column } from '@/components/ui/Table';
import ImageModal from '@/components/ui/ImageModal';

interface TopSellingReportProps {
  onBack: () => void;
}

const formatDate = (date: Date | string): string =>
  new Date(typeof date === 'string' ? date : date).toISOString().slice(0, 10);

export const TopSellingReport: React.FC<TopSellingReportProps> = () => {
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: formatDate(new Date()),
    end: formatDate(new Date()),
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rows, setRows] = useState<TopSellingRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchTopSelling(range.start, range.end, searchTerm);
      setRows(data.rows);
      setIsFetched(true);
    } catch (e) {
      console.error('Fetch failed', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setIsFetched(false);
    setRows([]);
  };

  const columns: Column<TopSellingRow>[] = [
    { header: 'Product Name', accessor: 'productName', width: 'w-[16vw]' },
    { header: 'Units Sold', accessor: 'unitsSold', width: 'w-[10vw]' },
    { header: 'SKU', accessor: 'sku', width: 'w-[10vw]' },
    { header: 'Category', accessor: 'category', width: 'w-[14vw]' },
    {
      header: 'Product Image',
      width: 'w-[12vw]',
      cell: (row) => (
        <button
          onClick={() => setShowImage(row.imageLink)}
          className="text-primary underline"
        >
          View Image
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 bg-surface rounded-xl p-8">
   
      {/* Date Range + Search */}
      <div className="flex  lg:flex-row lg:justify-between lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
          <span className="text-black font-semibold mb-1 sm:mb-0">
            Selected Date Range
          </span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2 h-5 w-5 text-muted" />
              <input
                type="date"
                className="pl-10 pr-3 py-1 border-b border-muted bg-transparent text-primary focus:outline-none focus:border-primary"
                value={range.start}
                onChange={(e) => setRange((p) => ({ ...p, start: e.target.value }))}
              />
            </div>
            <span className="text-primary font-medium">to</span>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2 h-5 w-5 text-muted" />
              <input
                type="date"
                className="pl-10 pr-3 py-1 border-b border-muted bg-transparent text-primary focus:outline-none focus:border-primary"
                value={range.end}
                onChange={(e) => setRange((p) => ({ ...p, end: e.target.value }))}
              />
            </div>
            {!isFetched ? (
              <Button variant="primaryHorizontalGradient" onClick={fetchData} className='text-white'>
                {loading ? 'Fetching…' : 'Fetch Data'} 
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" disabled>
                  Fetch Data
                </Button>
                <button
                  onClick={handleClear}
                  className="p-2 rounded-full hover:bg-surface focus:outline-none focus:ring-0"
                >
                  <X size={20} className="text-muted" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className=" relative flex-1 max-w-sm justify-center items-center rounded-xl  bg-white">
          <Search className=" absolute h-5 w-5 text-muted top-2 left-3" size={18} />
          <input
            type="text"
            placeholder="Search Product"
            className="pl-10 pr-3 py-2  border-muted w-full bg-transparent text-primary focus:outline-none focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="">
        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : isFetched ? (
          <Table
            columns={columns}
            data={rows}
          />
        ) : (
          <div className="flex items-center justify-center h-60">
            <img
              src="/images/no-data-illustration.png"
              alt="No Data"
              className="max-h-full"
            />
          </div>
        )}
      </div>

      {showImage && (
        <ImageModal imageUrl={showImage} onClose={() => setShowImage(null)} />
      )}
    </div>
  );
};

export default TopSellingReport;