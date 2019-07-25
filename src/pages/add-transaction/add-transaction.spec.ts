import { FormBuilder } from '@angular/forms';
import { SqlProvider } from '../../providers/sql/sql';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AddTransactionPage } from './add-transaction';
import { IonicModule, ViewController } from 'ionic-angular';
import { SqlProviderMock } from '../../mocks/sqlprovider.mocks'
//let component = undefined;

describe('Add Trasaction page', () => {
  let component: AddTransactionPage;
  let fixture: ComponentFixture<AddTransactionPage>;
  let de: DebugElement;

  let viewCtrlSpy = jasmine.createSpyObj('ViewController', 
                          ['data', 'readReady', 'writeReady', 'dismiss', '_setHeader', '_setNavbar', '_setIONContent', '_setIONContentRef'])
  viewCtrlSpy['readReady'] = {
    subscribe(){}
  }
  viewCtrlSpy.writeReady = {
    subscribe(){}
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTransactionPage],
      imports: [IonicModule.forRoot(AddTransactionPage)],
      providers: [{ provide : ViewController, useValue: viewCtrlSpy }, 
        { provide: SqlProvider, useValue: SqlProviderMock },
        FormBuilder],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof AddTransactionPage).toBeTruthy()
  });

  it('form should invalid when there no value in formfield', () => {
    expect(component.transaction.valid).toBeFalsy()
  })





});
