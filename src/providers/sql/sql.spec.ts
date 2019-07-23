import { SqlProvider } from './sql';


let sqlprov = new SqlProvider();


describe('sql service',() => {

    it('should return non empty array',() => {
        let arr = sqlprov.selctTable();
        expect(Array.isArray(arr)).toBeTruthy();
        expect(arr.length).toBeGreaterThan(0)
    })
})