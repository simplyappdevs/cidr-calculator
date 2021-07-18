/**
* App imports
*/
import {CIDRModule, OCTECTS} from '../src';

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
      const res: OCTECTS = CIDRModule.parseOctects('172.21.0.1');

      expect(res).toBeDefined();
      //expect(res).toContain()
    });
  });
});