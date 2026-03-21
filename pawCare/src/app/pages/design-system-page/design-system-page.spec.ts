import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSystemPage } from './design-system-page';

describe('DesignSystemPage', () => {
  let component: DesignSystemPage;
  let fixture: ComponentFixture<DesignSystemPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSystemPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSystemPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
