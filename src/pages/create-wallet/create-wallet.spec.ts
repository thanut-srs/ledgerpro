import { FormBuilder } from '@angular/forms';
import { SqlProvider } from '../../providers/sql/sql';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CreateWalletPage } from './create-wallet';
import { IonicModule, ViewController, NavController, NavParams } from 'ionic-angular';
import { SqlProviderMock } from '../../mocks/sqlprovider.mocks'
import { NavParamsMock } from '../../mocks/navparam.mocks'

describe('create wallet page', () => {
  let component: CreateWalletPage;
  let fixture: ComponentFixture<CreateWalletPage>;
  let de: DebugElement;

  let viewCtrlSpy = jasmine.createSpyObj('ViewController',
    ['data', 'readReady', 'writeReady', 'dismiss', '_setHeader', '_setNavbar', '_setIONContent', '_setIONContentRef'])
  viewCtrlSpy['readReady'] = {
    subscribe() { }
  }
  viewCtrlSpy.writeReady = {
    subscribe() { }
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateWalletPage],
      imports: [IonicModule.forRoot(CreateWalletPage)],
      providers: [{ provide: ViewController, useValue: viewCtrlSpy },
      { provide: SqlProvider, useValue: SqlProviderMock },
      { provide: NavParams,useValue: NavParamsMock},
        FormBuilder,
        NavController],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof CreateWalletPage).toBeTruthy()
  });

  it('form should invalid when there no value in formfield', () => {

  })

  it('form should valid when there is value in formfield', () => {

  })

  it('submit form should call createwallet', () => {

  })





});
