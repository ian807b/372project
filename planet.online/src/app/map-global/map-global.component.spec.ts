import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGlobalComponent } from './map-global.component';

describe('MapGlobalComponent', () => {
  let component: MapGlobalComponent;
  let fixture: ComponentFixture<MapGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapGlobalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
