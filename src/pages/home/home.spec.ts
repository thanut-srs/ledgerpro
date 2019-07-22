import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { HomePage } from './home';
import { NavController, ModalController, IonicModule } from 'ionic-angular';

let component = undefined;

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let de: DebugElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(HomePage)],
      providers: [ NavController,ModalController],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof HomePage).toBeTruthy()
  });

 
  it('should have <h1> with id=date display today date',() => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let monthList = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let today = day + " " + monthList[month] + " " + year;
    let dateHeader: HTMLElement = fixture.debugElement.query(By.css('#date')).nativeElement;
    expect(dateHeader.innerText).toEqual(today);
  })


});
