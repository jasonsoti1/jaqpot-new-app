import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskForIdComponent } from './ask-for-id.component';

describe('AskForIdComponent', () => {
  let component: AskForIdComponent;
  let fixture: ComponentFixture<AskForIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskForIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskForIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
