import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface EventFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'date' | 'newest';
  onSortChange: (sort: 'date' | 'newest') => void;
}

export default function EventFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2 min-w-[200px]">
        <Label className="text-xs text-muted-foreground">Category</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 min-w-[200px]">
        <Label className="text-xs text-muted-foreground">Sort By</Label>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as 'date' | 'newest')}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (Earliest First)</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
