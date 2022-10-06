import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsRegistryComponent } from './units-registry.component';

fdescribe('UnitsRegistryComponent', () => {
  let component: UnitsRegistryComponent;
  let fixture: ComponentFixture<UnitsRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsRegistryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
