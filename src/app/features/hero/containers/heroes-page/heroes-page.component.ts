import { Component, effect, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HeroService } from '../../services/hero.service';
import { GridComponent } from '@app/shared/components/grid/grid.component';
import { ChipComponent } from '@app/shared/components/chip/chip.component';
import { filter, map, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeroInfoDialogComponent } from '@hero/components/hero-info-dialog/hero-info-dialog.component';
import { Hero, HeroKey } from '@hero/models/hero.model';
import { PieChartComponent } from '@shared/components/pie-chart/pie-chart.component';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-heroes-page',
    imports: [
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        GridComponent,
        ChipComponent,
        MatButtonModule,
        MatDialogModule,
        PieChartComponent,
    ],
    providers: [ HeroService ],
    templateUrl: './heroes-page.component.html',
    standalone: true,
    styleUrl: './heroes-page.component.scss',
})
export class HeroesPageComponent {
    private dialog = inject(MatDialog);
    private heroService = inject(HeroService);

    private readonly refreshTrigger = signal(true);
    private readonly heroesChipList = signal<string[]>([]);
    readonly genderChartInfo = signal<{label: string, count: number}[]>([]);

    heroList = signal<Hero[]>([]);

    constructor() {
        effect(() => {
            this.heroService.getHeroesList().pipe(
                take(1),
                filter(() => this.refreshTrigger()),
                map(heroes =>
                    {
                        this.refreshTrigger.set(false);
                        // TODO: need to refactor and do filtering in grid component in MatTableDataSource filter and filter function
                        return this.heroesChipList().length
                            ? heroes.filter(hero => this.isChipMatch(hero, this.heroesChipList()))
                            : heroes;
                    }
                )
            ).subscribe(heroes => {
                this.heroList.set(heroes);
                this.genderChartInfo.set(this.calculateDataForChart("genderLabel"));
            });
        });
    }

    heroesListFilterChanged(heroesChipList: string[]): void {
        this.refreshTrigger.set(true);
        this.heroesChipList.set(heroesChipList);

    }

    gridRowClicked(hero: Hero) {
        this.openHeroDialog(hero, true);
    }

    deleteHero(heroName: string): void {
        this.heroService.deleteHero(heroName);
        this.refreshTrigger.set(true);
    }

    editHero(hero: Hero): void {
        this.openHeroDialog(hero, false, true);
    }

    createHero() {
        this.openHeroDialog(null, false)
    }

    calculateDataForChart(heroKeyName: HeroKey) {
        return Object.entries(
            this.heroList().reduce((acc, item) => {
                const key: string = item[heroKeyName];
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ).map(([label, count]) => ({ label, count }));
    }

    private openHeroDialog(hero: Hero | null, isReadOnly: boolean, isEditing = false): void {
        const dialogRef = this.dialog.open(HeroInfoDialogComponent, {
            width: '400px',
            data: { hero, isReadOnly, isEditing },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.hero) {
                result.isEditing ? this.heroService.updateHero(result.hero) : this.heroService.addNewHero(result.hero);
                this.refreshTrigger.set(true);
            }
        });
    }

    private isChipMatch(hero: Hero, chips: string[]): boolean {
        return chips.some(chip => chip.toLowerCase() === hero.nameLabel.toLowerCase());
    }
}
