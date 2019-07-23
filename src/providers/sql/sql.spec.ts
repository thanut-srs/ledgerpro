import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SqlProvider } from './sql';




describe('sql service',() => {
    let sqlprov:SqlProvider;

 
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            providers: [HttpClient,SqlProvider],
            imports: [HttpClientModule]
        });
        sqlprov = TestBed.get(SqlProvider)
      });
    

    it('should be created', () => {
        expect(sqlprov).toBeTruthy();
      });

    it('should return non empty array',() => {
        let arr = sqlprov.selctTable();
        expect(Array.isArray(arr)).toBeTruthy();
        expect(arr.length).toBeGreaterThan(0)
    })

    it('should return success word when create table success', () => {
        //spyOn(sqlprov,'createTable')
        let res = sqlprov.createTable();
        // expect(sqlprov.createTable).toHaveBeenCalledWith(jasmine.any(Object))
        // expect(sqlprov.createTable).toHaveBeenCalledTimes(1)
        expect(res).toContain('success')
    })
})

