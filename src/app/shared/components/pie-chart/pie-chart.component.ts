import { Component, input, OnInit, effect, ElementRef, inject, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3';

interface PieChartData {
    label: string;
    count: number;
    color?: string;
}

/*
Didnt work with D3 + Angular, was using d3 6-7 years ago just for one small project.
Was using some ai and google to do this chart. Because I was out of time and didnt wont to take more time with it.
If for current position it is required to know I will learn it in 1-2 weeks just
continue working on this demo project but implementing everyhthing by myself
 */

@Component({
    selector: 'app-pie-chart',
    imports: [],
    templateUrl: './pie-chart.component.html',
    standalone: true,
    styleUrl: './pie-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnInit {
    data = input<PieChartData[]>([]);

    private elementRef = inject(ElementRef);
    private svg: any;
    private g: any;
    private margin = 50;
    private width = 250;
    private height = 200;
    private radius = Math.min(this.width, this.height) / 2 - this.margin;
    private colors: any;
    private pie: any;
    private arc: any;
    private labelArc: any;

    constructor() {
        // React to data changes using Angular's effect()
        effect(() => {
            const currentData = this.data();
            if (currentData && currentData.length > 0 && this.svg) {
                this.updateChart();
            }
        });
    }

    ngOnInit(): void {
        this.initializeChart();
    }

    private initializeChart(): void {
        this.createSvg();
        this.setupD3Elements();
        this.createColors();

        // Draw initial chart if data exists
        if (this.data() && this.data().length > 0) {
            this.drawChart();
        }
    }

    private createSvg(): void {
        // Clear any existing SVG
        d3.select(this.elementRef.nativeElement).select("svg").remove();

        this.svg = d3.select(this.elementRef.nativeElement)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.g = this.svg
            .append("g")
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
    }

    private setupD3Elements(): void {
        // Setup pie generator
        this.pie = d3.pie<PieChartData>()
            .value((d: PieChartData) => d.count)
            .sort(null); // Maintain data order

        // Setup arc generators
        this.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);

        this.labelArc = d3.arc()
            .innerRadius(this.radius * 0.7)
            .outerRadius(this.radius * 0.7);
    }

    private createColors(): void {
        const currentData = this.data();
        if (!currentData || currentData.length === 0) return;

        this.colors = d3.scaleOrdinal()
            .domain(currentData.map(d => d.label))
            .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782", "#4a5568", "#2d3748"]);
    }

    private drawChart(): void {
        const currentData = this.data();
        if (!currentData || currentData.length === 0) return;

        this.createColors();
        const pieData = this.pie(currentData);

        // Draw pie slices
        this.drawPieSlices(pieData);

        // Draw labels
        this.drawLabels(pieData);
    }

    private drawPieSlices(pieData: any[]): void {
        const slices = this.g.selectAll('.pie-slice')
            .data(pieData, (d: any) => d.data.label);

        // Remove old slices
        slices.exit()
            .transition()
            .duration(500)
            .attrTween('d', (d: any) => {
                const interpolate = d3.interpolate(d, { startAngle: 0, endAngle: 0 });
                return (t: number) => this.arc(interpolate(t));
            })
            .remove();

        // Add new slices
        const newSlices = slices.enter()
            .append('path')
            .attr('class', 'pie-slice')
            .attr('fill', (d: any) => this.colors(d.data.label))
            .attr('stroke', '#121926')
            .style('stroke-width', '1px')
            .style('opacity', 0);

        // Update all slices (new + existing)
        newSlices.merge(slices)
            .transition()
            .duration(750)
            .style('opacity', 1)
            .attr('fill', (d: any) => this.colors(d.data.label))
            .attrTween('d', (d: any) => {
                // Store the current angles for smooth transitions
                const currentAngles = this.getCurrentAngles(d);
                const interpolate = d3.interpolate(currentAngles, d);
                return (t: number) => this.arc(interpolate(t));
            });
    }

    private drawLabels(pieData: any[]): void {
        const labels = this.g.selectAll('.pie-label')
            .data(pieData, (d: any) => d.data.label);

        // Remove old labels
        labels.exit()
            .transition()
            .duration(500)
            .style('opacity', 0)
            .remove();

        // Add new labels
        const newLabels = labels.enter()
            .append('text')
            .attr('class', 'pie-label')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .style('opacity', 0);

        // Update all labels
        newLabels.merge(labels)
            .transition()
            .duration(750)
            .style('opacity', 1)
            .attr('transform', (d: any) => `translate(${this.labelArc.centroid(d)})`)
            .text((d: any) => {
                const percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1);
                return `${d.data.label} (${percentage}%)`;
            });
    }

    private getCurrentAngles(d: any): any {
        // Get current angles from existing element for smooth transitions
        const currentSlice = this.g.select(`[data-label="${d.data.label}"]`);
        if (currentSlice.empty()) {
            return { startAngle: 0, endAngle: 0 };
        }
        return d;
    }

    private updateChart(): void {
        const currentData = this.data();
        if (!currentData || currentData.length === 0) {
            this.clearChart();
            return;
        }

        this.drawChart();
    }

    private clearChart(): void {
        if (this.g) {
            this.g.selectAll('.pie-slice')
                .transition()
                .duration(500)
                .style('opacity', 0)
                .remove();

            this.g.selectAll('.pie-label')
                .transition()
                .duration(500)
                .style('opacity', 0)
                .remove();
        }
    }

    // Public method to manually trigger update (if needed)
    public updateData(newData: PieChartData[]): void {
        // This would typically be handled by the input binding
        // but you can use this for programmatic updates
        this.updateChart();
    }

    // Public method to resize chart
    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.radius = Math.min(this.width, this.height) / 2 - this.margin;

        this.svg
            .attr("width", this.width)
            .attr("height", this.height);

        this.g.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

        this.setupD3Elements();
        this.updateChart();
    }
}
