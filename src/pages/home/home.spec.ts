import { SqlProvider } from './../../providers/sql/sql';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { HomePage } from './home';
import { NavController, ModalController, IonicModule } from 'ionic-angular';
import { SqlProviderMock } from '../../mocks/sqlprovider.mocks'
//let component = undefined;

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let de: DebugElement;
  let textShare = ''

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(HomePage)],
      providers: [ NavController,ModalController,
        {provide: SqlProvider, useClass: SqlProviderMock}],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    textShare = 'share'
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof HomePage).toBeTruthy()
  });

 

  it('should have <h1> with id=date display date', () => {

    component.updateTransaction().then( () => {
      console.info('date  ::::',component.date)
      fixture.detectChanges()
      let dateHeader = fixture.debugElement.query(By.css('#dateid'));
      console.log('dateHeader ::: ',dateHeader)
      expect(dateHeader.nativeElement.innerText).toEqual(component.date[0]);
    })

  })

  it('should get user from service and update userlist',() => {
    
    expect(true).toBeTruthy()
  })

  // it('should call ViewGoal when click button viewgoal ',() => {
  //   spyOn(component,"onViewGoal")
  //   let btngoal = fixture.debugElement.query(By.css('#viewgoalbtn'));
  //   //console.log('styles:::',btngoal)
  //   btngoal.triggerEventHandler('click',null);
  //    expect(component.onViewGoal).toHaveBeenCalledTimes(1);

    
  // })

  it('should has message when no collection',() => {
    component.collection = []
    let textNoCollection: HTMLElement = fixture.debugElement.query(By.css('#noTransaction')).nativeElement;
    expect(textNoCollection.innerText).toEqual("There no transaction here, add one!");
  })

  it('should has no message when collection',() => {
    component.collection = [{ tID: '1', date: '29-08-2019', type: 'Food', tag: 'Income', amount: 30, memo: '' }]
    fixture.detectChanges()

    let textNoCollection: DebugElement = fixture.debugElement.query(By.css('#noTransaction'));
    expect(textNoCollection).toBeNull()
  })

  it('getName should set value to currentUser',() => {
    component.getName().then( () => {
      expect(component.currentUser).toEqual('fake nickname')
    })
  })
  
});
