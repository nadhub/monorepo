import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() sortable = true;
  @Input() paginated = true;
  @Input() pageSize = 10;

  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<SortEvent>();

  currentPage = signal(0);
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  paginatedData = computed(() => {
    if (!this.paginated) return this.data;
    const start = this.currentPage() * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.data.length / this.pageSize);
  });

  onSort(column: TableColumn): void {
    if (!column.sortable || !this.sortable) return;
    
    if (this.sortColumn() === column.key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column.key);
      this.sortDirection.set('asc');
    }
    
    this.sortChange.emit({
      column: column.key,
      direction: this.sortDirection()
    });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
    }
  }
}
