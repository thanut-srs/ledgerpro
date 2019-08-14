import { TestBed } from '@angular/core/testing';
import { SqlProvider } from './sql';
import { SQLite } from '@ionic-native/sqlite';
import { ModalController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';




describe('sql service',() => {
    let sqlprov:SqlProvider;

    // mock modal https://stackoverflow.com/questions/50824441/testing-modalcontroller-ionic-3-spyon-method-not-called
    let modalSpy = jasmine.createSpyObj('Modal', ['present']);
    let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalCtrlSpy.create.and.callFake(function () {
        return modalSpy;
    });
 
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [SqlProvider,SQLite,
              {provide: ModalController , useValue: modalCtrlSpy},
             LocalNotifications],
        });
        sqlprov = TestBed.get(SqlProvider)
      });
    

    it('should be created', () => {
        expect(sqlprov).toBeTruthy();
      });
    
})

