import { TestBed } from '@angular/core/testing';
import { SqlProvider } from './sql';
import { SQLite } from '@ionic-native/sqlite';




describe('sql service',() => {
    let sqlprov:SqlProvider;

 
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [SqlProvider,SQLite],
        });
        sqlprov = TestBed.get(SqlProvider)
      });
    

    it('should be created', () => {
        expect(sqlprov).toBeTruthy();
      });
    
})

