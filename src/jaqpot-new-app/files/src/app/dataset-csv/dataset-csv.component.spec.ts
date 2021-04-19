import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCsvComponent } from './dataset-csv.component';

describe('DatasetCsvComponent', () => {
  let component: DatasetCsvComponent;
  let fixture: ComponentFixture<DatasetCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
