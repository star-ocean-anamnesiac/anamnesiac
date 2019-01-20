import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCreatorPage } from './party-creator.page';

describe('PartyCreatorPage', () => {
  let component: PartyCreatorPage;
  let fixture: ComponentFixture<PartyCreatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyCreatorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCreatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
