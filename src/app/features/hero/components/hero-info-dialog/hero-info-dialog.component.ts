import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, output } from '@angular/core';
import { Hero } from '@hero/models/hero.model';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDialogRef
} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-hero-info-dialog',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule
    ],
    templateUrl: './hero-info-dialog.component.html',
    standalone: true,
    styleUrl: './hero-info-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroInfoDialogComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<HeroInfoDialogComponent>);
    readonly data = inject<{ hero: Hero | null, isReadOnly: boolean, isEditing: boolean }>(MAT_DIALOG_DATA);
    submittedForm = output<Hero>();

    private fb = inject(FormBuilder);

    heroForm!: FormGroup;

    ngOnInit(): void {
        // TODO: signal based form, to refactor
        this.heroForm = this.fb.group({
            nameLabel: new FormControl(this.data.hero?.nameLabel || '', Validators.required),
            genderLabel: new FormControl(this.data.hero?.genderLabel || '', Validators.required),
            citizenshipLabel: new FormControl(this.data.hero?.citizenshipLabel || '', Validators.required),
            skillsLabel: new FormControl(this.data.hero?.skillsLabel || '', Validators.required),
            occupationLabel: new FormControl(this.data.hero?.occupationLabel || '', Validators.required),
            memberOfLabel: new FormControl(this.data.hero?.memberOfLabel || '', Validators.required),
            creatorLabel: new FormControl(this.data.hero?.creatorLabel || '', Validators.required),
        })

        if (this.data.isReadOnly) {
            this.heroForm.disable({ emitEvent: false });
        }

        if (this.data.isEditing) {
            this.heroForm.get("nameLabel")?.disable({ emitEvent: false });
        }
    }

    handleFormSubmit(): void {
        if (this.heroForm.valid) {
            this.dialogRef.close({
                hero: this.heroForm.getRawValue(),
                isEditing: this.data.isEditing,
            });
        }
    }
}
