import { NavParamsMock } from './../../mocks/navparam.mocks';
import { FormBuilder } from '@angular/forms';
import { SqlProvider } from '../../providers/sql/sql';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AddTransactionPage } from './add-transaction';
import { IonicModule, ViewController, NavParams } from 'ionic-angular';
import { SqlProviderMock } from '../../mocks/sqlprovider.mocks'
//let component = undefined;

describe('Add Trasaction page', () => {
  let component: AddTransactionPage;
  let fixture: ComponentFixture<AddTransactionPage>;
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
      declarations: [AddTransactionPage],
      imports: [IonicModule.forRoot(AddTransactionPage)],
      providers: [{ provide: ViewController, useValue: viewCtrlSpy },
      { provide: SqlProvider, useValue: SqlProviderMock },
      { provide: NavParams, useValue: NavParamsMock },
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

  it('should have form', () => {
    let form = fixture.debugElement.query(By.css('#transactionForm'));
    expect(form).toBeDefined()
  })

  it('should have 7 form', () => {
    expect(Object.keys(component.transaction.controls).length).toEqual(7)
  })

  it('should have add transaction button', () => {
    let btnsubmit = fixture.debugElement.query(By.css('#submitbtn'));
    console.log('submit======', btnsubmit)
    expect(btnsubmit.name).toEqual('button')
  })

  it('inputamount field should not disabled', () => {
    let inputamt = fixture.debugElement.query(By.css('#amountinput'));
    expect(inputamt.children[0].properties.disabled).toBeFalsy()
  })

  it('form should invalid when there no value in formfield', () => {
    expect(component.transaction.valid).toBeFalsy()
  })

  it('type should have no value when enter app', () => {
    expect(component.transaction.controls['type'].value).toEqual('Expense')
  })
  it('tag should have no value when enter app', () => {
    expect(component.transaction.controls['tag'].value).toEqual('')
  })

  it('walletID should have no value when enter app', () => {
    expect(component.transaction.controls['walletID'].value).toEqual('default')
  })

  it('amount should have no value when enter app', () => {
    expect(component.transaction.controls['amount'].value).toEqual('')
  })
  it('memo should have no value when enter app', () => {
    expect(component.transaction.controls['memo'].value).toEqual('')
  })

  it('memo should not have validator', () => {
    expect(component.transaction.controls['memo'].validator).toBeNull()
  })
  it('amount should required', () => {
    let errors = component.transaction.controls['amount'].errors
    expect(errors['required']).toBeTruthy()
    component.transaction.controls['amount'].setValue('')
    expect(component.transaction.controls['amount'].valid).toBeFalsy()
  })

  it('component.currentDate should have no value when enter app', () => {
    component.setDate()
    expect(component.transaction.controls['date'].value).toEqual(component.currentDate)
  })

  const setFormTruthValue = function () {
    component.transaction.controls['type'].setValue('Income')
    component.transaction.controls['tag'].setValue('Food')
    component.transaction.controls['amount'].setValue(30)
    component.transaction.controls['walletID'].setValue('1')
    component.transaction.controls['memo'].setValue('nonthing')
    component.transaction.controls['date'].setValue('2019-07-22')
  }

  it('form should valid when there is value in formfield', () => {
    setFormTruthValue()
    expect(component.transaction.valid).toBeTruthy()
  })

  it('button should disable when there is no value in formfield', () => {
    let btnsubmit = fixture.debugElement.query(By.css('#submitbtn'))
    expect(btnsubmit.properties['disabled']).toBeTruthy()
  })

  it('button should enable when there is value in formfield', () => {
    let btnsubmit = fixture.debugElement.query(By.css('#submitbtn'))
    setFormTruthValue();
    fixture.detectChanges()
    expect(btnsubmit.properties['disabled']).toBeFalsy()
  })

  it('submit form should call function onInsertTable', () => {
    spyOn(component, "onInsertTable")
    let formsubmit = fixture.debugElement.query(By.css('#transactionForm'));
    formsubmit.triggerEventHandler('ngSubmit', null);
    expect(component.onInsertTable).toHaveBeenCalledTimes(1);
  })

  it('function setDate should set component.currentDate', () => {
    component.setDate()
    expect(component.currentDate).not.toBeNull
  })



});
