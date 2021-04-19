import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaqpotService } from './jaqpot-client.service';

describe('JaqpotApiComponent', () => {
  let component: JaqpotService;
  let fixture: ComponentFixture<JaqpotService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaqpotService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaqpotService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
