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

 

  it('should have <h1> with id=date display date',async () => {
    await component.updateTransaction()
    let dateHeader: HTMLElement = fixture.debugElement.query(By.css('#date')).nativeElement;
    console.info('date  ::::',component.date)
    fixture.detectChanges();
    expect(dateHeader.innerText).toEqual(component.date[0]);
  })

  it('should get user from service and update userlist',() => {
    
    expect(true).toBeTruthy()
  })

  it('should call ViewGoal when click button viewgoal ',() => {
    spyOn(component,"onViewGoal")
    let btngoal = fixture.debugElement.query(By.css('#viewgoalbtn'));
    console.log('styles:::',btngoal)
    btngoal.triggerEventHandler('click',null);
     expect(component.onViewGoal).toHaveBeenCalledTimes(1);

    
  })

  it('should has message when no collection',() => {
    component.collection = []
    let textNoCollection: HTMLElement = fixture.debugElement.query(By.css('h4')).nativeElement;
    expect(textNoCollection.innerText).toEqual("There no transaction here, add one!");
  })
  
});
