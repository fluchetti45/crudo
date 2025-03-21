import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { NgIf, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface ProductsByCategoryCount {
  categoryId: number;
  categoryName: string;
  totalProducts: number;
}

interface DashboardResponse {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalSales: number;
  productsByCategory: ProductsByCategoryCount[];
}

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, RouterLink, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('barChart') barChart!: ElementRef;
  private _dashboardService = inject(DashboardService);
  loading: boolean = true;
  response: DashboardResponse | null = null;
  error: any;
  chart: any;
  createdChart: boolean = false;
  chartColors = [
    'rgba(67, 97, 238, 0.7)',
    'rgba(58, 134, 255, 0.7)',
    'rgba(247, 37, 133, 0.7)',
    'rgba(114, 9, 183, 0.7)',
    'rgba(72, 149, 239, 0.7)',
    'rgba(76, 201, 240, 0.7)',
    'rgba(67, 170, 139, 0.7)',
    'rgba(144, 190, 109, 0.7)',
    'rgba(249, 65, 68, 0.7)',
    'rgba(243, 114, 44, 0.7)',
    'rgba(248, 150, 30, 0.7)',
    'rgba(249, 199, 79, 0.7)',
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this._dashboardService.getDashboardData().subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
        this.createChart(res.productsByCategory);
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
        console.log(error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart(data: ProductsByCategoryCount[]) {
    const labels = data.map((product) => product.categoryName);
    const values = data.map((product) => product.totalProducts);
    const ctx = this.barChart.nativeElement.getContext('2d');

    // Generar colores para cada barra
    const backgroundColors = this.generateColors(data.length);
    const borderColors = backgroundColors.map((color) =>
      color.replace('0.7', '1')
    );

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 6,
            maxBarThickness: 50,
            minBarLength: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              font: {
                size: 12,
              },
              color: '#6c757d',
            },
            title: {
              display: true,
              text: 'Cantidad de Productos',
              color: '#495057',
              font: {
                size: 13,
                weight: 'bold',
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
              color: '#6c757d',
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              size: 14,
            },
            bodyFont: {
              size: 13,
            },
            padding: 4,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: (context) => `Productos: ${context.parsed.y}`,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
      },
    };

    this.chart = new Chart(ctx, config);
    this.createdChart = true;
  }

  // Generar colores para las barras
  private generateColors(count: number): string[] {
    const colors: string[] = [];

    // Si tenemos suficientes colores predefinidos, los usamos
    if (count <= this.chartColors.length) {
      return this.chartColors.slice(0, count);
    }

    // Si necesitamos más colores, repetimos los existentes
    for (let i = 0; i < count; i++) {
      colors.push(this.chartColors[i % this.chartColors.length]);
    }

    return colors;
  }

  // Obtener la categoría con más productos
  getTopCategory(): string {
    if (!this.response || this.response.productsByCategory.length === 0)
      return 'N/A';

    const topCategory = this.response.productsByCategory[0];

    return `${topCategory.categoryName} (${topCategory.totalProducts})`;
  }
}
