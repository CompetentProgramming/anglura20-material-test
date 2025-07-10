import { Component, ViewChild, effect, input, output, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Hero } from '@hero/models/hero.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-grid',
    imports: [ MatTableModule, MatSortModule, MatIconModule],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    data = input<Hero[] | null>(null);
    heroNameFilter = input<string[] | null>(null);
    gridRowClicked = output<Hero>();
    deleteHeroClicked = output<string>();
    editHeroClicked = output<Hero>();

    dataSource: MatTableDataSource<Hero> = new MatTableDataSource();
    columns: string[] = [
        "nameLabel",
        "genderLabel",
        "citizenshipLabel",
        "skillsLabel",
        "occupationLabel",
        "memberOfLabel",
        "creatorLabel",
        "actions",
    ];

    constructor() {
        effect(() => {
            this.dataSource = new MatTableDataSource(this.data() ?? []);
            if (this.sort) {
                this.dataSource.sort = this.sort;
            }
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    rowClicked(row: Hero) {
        this.gridRowClicked.emit(row);
    }

    deleteHero(event: MouseEvent, hero: Hero) {
        event.stopPropagation();
        this.deleteHeroClicked.emit(hero.nameLabel);
    }

    editHero(event: MouseEvent, hero: Hero) {
        event.stopPropagation();
        this.editHeroClicked.emit(hero);
    }
}
