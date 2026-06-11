import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonCutomizer } from './neon-cutomizer';

describe('NeonCutomizer', () => {
  let component: NeonCutomizer;
  let fixture: ComponentFixture<NeonCutomizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeonCutomizer],
    }).compileComponents();

    fixture = TestBed.createComponent(NeonCutomizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
