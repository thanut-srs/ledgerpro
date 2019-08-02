export class NavParamsMock {
    static returnParam = null;
    public static get(key): any {
      if (NavParamsMock.returnParam) {
         return NavParamsMock.returnParam
      }
      return 'default';
    }
    static setParams(value){
      NavParamsMock.returnParam = value;
    }
  }