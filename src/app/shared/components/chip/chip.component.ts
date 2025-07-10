import { ChangeDetectionStrategy, Component, model } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-chip',
    imports: [ MatFormFieldModule, MatChipsModule, MatIconModule ],
    templateUrl: './chip.component.html',
    standalone: true,
    styleUrl: './chip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
    heroesList = model<string[]>([]);

    constructor() {}

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.heroesList.update(heroName => [...heroName, value]);
        }
        event.chipInput!.clear();
    }

    remove(heroName: string): void {
        this.heroesList.update(heroes => {
            const index = heroes.indexOf(heroName);
            if (index < 0) {
                return heroes;
            }

            heroes.splice(index, 1);
            return [...heroes];
        });
    }
}
