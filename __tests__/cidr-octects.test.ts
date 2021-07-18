/**
* App imports
*/
import {CIDRModule, IPTUPPLE, OCTECTS, OCTECTSMIN} from '../src';

const obj1: OCTECTS = {
  first: 172,
  second: 21,
  third: 0,
  fourth: 1,
  add: (num: number): OCTECTS => {return {} as any},
  substract: (num: number): OCTECTS => {return {} as any;},
  toArray: (): IPTUPPLE => {return [172, 21, 0, 1];},
  toString: (): string => {return '172.21.0.1';},
  toBinary: (): string => {return '10101100000101010000000000000001';}
};

const obj256: OCTECTS = {
  first: 172,
  second: 21,
  third: 1,
  fourth: 1,
  add: (num: number): OCTECTS => {return {} as any;},
  substract: (num: number): OCTECTS => {return {} as any;},
  toArray: (): IPTUPPLE => {return [172, 21, 1, 1];},
  toString: (): string => {return '172.21.1.1';},
  toBinary: (): string => {return '10101100000101010000000100000001';}
};

const objMinus256: OCTECTS = {
  first: 172,
  second: 20,
  third: 255,
  fourth: 1,
  add: (num: number): OCTECTS => {return {} as any;},
  substract: (num: number): OCTECTS => {return {} as any;},
  toArray: (): IPTUPPLE => {return [172, 20, 255, 1];},
  toString: (): string => {return '172.20.255.1';},
  toBinary: (): string => {return '10101100000101001111111100000001';}
};

const MAXOCTECTSNUM: number = 0xFFFFFFFF >>> 0;

/**
 * OCTECTS Unittests
 */
describe('OCTECTS Unittests', () => {

  /**
   * OCTECTS success unittests
   */
  describe('OCTECTS success unittests', () => {
    test('OCTECTS from STRING', () => {
      const res: OCTECTS = CIDRModule.parseOctects('172.21.0.1');

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS from NUMBER', () => {
      const res: OCTECTS = CIDRModule.parseOctects(2887057409);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS from IPTUPPLE', () => {
      const res: OCTECTS = CIDRModule.parseOctects([172, 21, 0, 1]);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS from OCTECTS', () => {
      const res: OCTECTS = CIDRModule.parseOctects(obj1);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS .toString()', () => {
      const res: OCTECTS = CIDRModule.parseOctects([172, 21, 0, 1]);

      expect(res).toBeDefined();
      expect(res.toString()).toBe('172.21.0.1');
    });

    test('OCTECTS .toArray()', () => {
      const res: OCTECTS = CIDRModule.parseOctects([172, 21, 0, 1]);

      expect(res).toBeDefined();
      expect(JSON.stringify(res.toArray())).toContain(JSON.stringify([172, 21, 0, 1]));
    });

    test('OCTECTS .toBinary()', () => {
      const res: OCTECTS = CIDRModule.parseOctects([172, 21, 0, 1]);

      expect(res).toBeDefined();
      expect(res.toBinary()).toEqual(obj1.toBinary());
    });

    test('OCTECTS default interface .toBinary()', () => {
      expect(OCTECTSMIN.toBinary()).toEqual('0'.padStart(32, '0'));
    });

    test('OCTECTS .add()', () => {
      const res: OCTECTS = CIDRModule.addToIP([172, 21, 0, 1], 256);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj256));
    });

    test('OCTECTS .add(0)', () => {
      const res: OCTECTS = CIDRModule.addToIP([172, 21, 0, 1], 0);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS .substract()', () => {
      const res: OCTECTS = CIDRModule.substractFromIP([172, 21, 0, 1], 256);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(objMinus256));
    });

    test('OCTECTS .substract(0)', () => {
      const res: OCTECTS = CIDRModule.substractFromIP([172, 21, 0, 1], 0);

      expect(res).toBeDefined();
      expect(JSON.stringify(res)).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS .octectsToNumber()', () => {
      const res: OCTECTS = CIDRModule.parseOctects([172, 21, 0, 1]);

      expect(res).toBeDefined();
      expect(CIDRModule.octectsToNumber(res)).toBe(2887057409);
    });

    test('OCTECTS default interface add', () => {
      const num: number = 2887057409;

      expect(JSON.stringify(OCTECTSMIN.add(num))).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS interface add', () => {
      const num: number = 2887057409;
      const octs: OCTECTS = CIDRModule.parseOctects('0.0.0.0');

      expect(JSON.stringify(octs.add(num))).toBe(JSON.stringify(obj1));
    });

    test('OCTECTS interface substract', () => {
      const num: number = 2887057409;
      const octs: OCTECTS = CIDRModule.parseOctects('172.21.0.1');

      expect(JSON.stringify(octs.substract(num))).toBe(JSON.stringify(OCTECTSMIN));
    });
  });

  /**
   * OCTECTS exception unittests
   */
  describe('OCTECTS exception unittests', () => {
    test('Invalid string octects value > 255', () => {
      expect(() => {
        CIDRModule.parseOctects('172.21.0.256');
      }).toThrowError('One or more octect values are invalid');
    });

    test('Invalid string octects value not number', () => {
      expect(() => {
        CIDRModule.parseOctects('172.21.A.256');
      }).toThrowError('Invalid IP format');
    });

    test('Invalid number octects value > MAXIP', () => {
      const num: number = MAXOCTECTSNUM + 1;

      expect(() => {
        CIDRModule.parseOctects(num);
      }).toThrowError(`Number ${num} is greater than maximum octects value ${MAXOCTECTSNUM}`);
    });

    test('Invalid add to MAXIP', () => {
      const curVal = '255.255.255.255';

      expect(() => {
        CIDRModule.addToIP(curVal, 1);
      }).toThrowError(`Cannot add to \'${curVal}\'`);
    });

    test('Invalid add negative number', () => {
      const curVal = -10;

      expect(() => {
        CIDRModule.addToIP('172.21.0.1', curVal);
      }).toThrowError(`Invalid number \'${curVal}\' to add`);
    });

    test('Invalid add result > MAXIP', () => {
      const curVal = '255.255.255.250';
      const num = 10;

      const curValOcts: OCTECTS = CIDRModule.parseOctects(curVal);
      const curValOctsNum: number = CIDRModule.octectsToNumber(curValOcts);
      const octNum = curValOctsNum + num;

      expect(() => {
        CIDRModule.addToIP(curVal, num);
      }).toThrowError(`Resulting value \'${octNum}\' is greater than maximum octects value \'${MAXOCTECTSNUM}\'`);
    });

    test('Invalid substract to MINIP', () => {
      const curVal = '0.0.0.0';

      expect(() => {
        CIDRModule.substractFromIP(curVal, 1);
      }).toThrowError(`Cannot substract from \'${curVal}\'`);
    });

    test('OCTECTS default interface substract', () => {
      expect(() => {
        OCTECTSMIN.substract(10);
      }).toThrowError(`Cannot substract from \'0.0.0.0\'`);
    });

    test('Invalid substract negative number', () => {
      const curVal = -10;

      expect(() => {
        CIDRModule.substractFromIP('172.21.0.1', curVal);
      }).toThrowError(`Invalid number \'${curVal}\' to substract`);
    });
  });
});