/**
* App imports
*/
import {CIDRModule, IPTUPPLE, OCTECTS} from '../src';

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

/**
 * CIDR calculator unittests
 */
describe('CIDR Calculator Module', () => {

  /**
   * OCTECTS unittests
   */
  describe('OCTECTS Unittests', () => {

    /**
     * OCTECTS from string
     */
    test('OCTECTS from STRING', () => {
      const res = CIDRModule.parseOctects('172.21.0.1');

      expect(res).toBeDefined();
      expect(obj1).toMatchObject(obj1);
    });
  });
});