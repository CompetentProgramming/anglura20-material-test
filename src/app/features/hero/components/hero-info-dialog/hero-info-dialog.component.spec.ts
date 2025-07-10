import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroInfoDialogComponent } from './hero-info-dialog.component';

describe('HeroInfoDialogComponent', () => {
  let component: HeroInfoDialogComponent;
  let fixture: ComponentFixture<HeroInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
