import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacesAdminComponent } from './spaces-admin.component';

describe('SpacesAdminComponent', () => {
  let component: SpacesAdminComponent;
  let fixture: ComponentFixture<SpacesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpacesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpacesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
