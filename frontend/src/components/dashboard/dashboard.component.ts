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
import { Router, RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ProductsCategoryCount } from '../../app/models/dashboard/products-category-count.interface';
import { TopProduct } from '../../app/models/dashboard/top-product.interface';
import { TopCategory } from '../../app/models/dashboard/top-category.interface';
import { OrderStatus } from '../../app/models/dashboard/order-status.interface';
import { DashboardResponse } from '../../app/models/dashboard/dashboard-response.interface';
@Component({
  selector: 'app-dashboard',
  imports: [NgIf, RouterLink, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('pieChart') pieChart!: ElementRef;
  @ViewChild('topCategoriesChart') topCategoriesChart!: ElementRef;
  @ViewChild('orderStatusChart') orderStatusChart!: ElementRef;

  private _dashboardService = inject(DashboardService);
  private _router = inject(Router);
  loading: boolean = true;
  response: DashboardResponse | null = null;
  error: any;
  barChartObject: any;
  pieChartObject: any;
  topCategoriesChartObject: any;
  orderStatusChartObject: any;
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
        this.createBarChart(res.productsByCategory);
        this.createPieChart(res.topProducts);
        this.createTopCategoriesChart(res.topCategories);
        this.createOrderStatusChart(res.orderStatus);
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.barChartObject || this.pieChartObject) {
      this.barChartObject.destroy();
      this.pieChartObject.destroy();
      this.topCategoriesChartObject.destroy();
      this.orderStatusChartObject.destroy();
    }
  }

  createBarChart(data: ProductsCategoryCount[]) {
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
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const categoryId = data[index].categoryId;
            this._router.navigate(['/category', categoryId]);
          }
        },
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

    this.barChartObject = new Chart(ctx, config);
    this.createdChart = true;
  }

  //
  createPieChart(data: TopProduct[]) {
    const labels = data.map((product) => product.productName);
    const values = data.map((product) => product.totalSold);
    const ctx = this.pieChart.nativeElement.getContext('2d');
    const backgroundColors = this.generateColors(data.length);
    const borderColors = backgroundColors.map((color) =>
      color.replace('0.7', '1')
    );
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const productId = data[index].productId;
            this._router.navigate(['/product', productId]);
          }
        },
      },
    };

    this.pieChartObject = new Chart(ctx, config);
    this.createdChart = true;
  }

  createTopCategoriesChart(data: TopCategory[]) {
    const labels = data.map((category) => category.categoryName);
    const values = data.map((category) => category.totalSales);
    const ctx = this.topCategoriesChart.nativeElement.getContext('2d');
    const backgroundColors = this.generateColors(data.length);
    const borderColors = backgroundColors.map((color) =>
      color.replace('0.7', '1')
    );
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const categoryId = data[index].categoryId;
            this._router.navigate(['/category', categoryId]);
          }
        },
      },
    };

    this.topCategoriesChartObject = new Chart(ctx, config);
    this.createdChart = true;
  }

  createOrderStatusChart(data: OrderStatus[]) {
    const labels = data.map((order) => order.status);
    const values = data.map((order) => order.totalOrders);
    const ctx = this.orderStatusChart.nativeElement.getContext('2d');
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
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
    this.orderStatusChartObject = new Chart(ctx, config);
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
