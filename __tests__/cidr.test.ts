/**
* App imports
*/
import {CIDR, CIDRInformation, IPTUPPLE, OCTECTS, CIDRModule} from '../src';

const oct1: OCTECTS = {
  first: 74,
  second: 125,
  third: 227,
  fourth: 10,
  add: (num: number): OCTECTS => {return {} as any;},
  substract: (num: number): OCTECTS => {return {} as any;},
  toArray: (): IPTUPPLE => {return [74, 125, 227, 10];},
  toString: (): string => {return '74.125.227.10';},
  toBinary: (): string => {return '1001010011111011110001100001010';}
};

const oct2: OCTECTS = {
  first: 74,
  second: 125,
  third: 227,
  fourth: 29,
  add: (num: number): OCTECTS => {return {} as any;},
  substract: (num: number): OCTECTS => {return {} as any;},
  toArray: (): IPTUPPLE => {return [74, 125, 227, 29];},
  toString: (): string => {return '74.125.227.29';},
  toBinary: (): string => {return '01001010011111011110001100011101';}
};

const oct3: OCTECTS = {
  first: 0,
  second: 0,
  third: 0,
  fourth: 0,
  add: (num: number): OCTECTS => {return {} as any;},
  substract: (num: number): OCTECTS => {return {} as any;},
  toArray: (): IPTUPPLE => {return [0, 0, 0, 0];},
  toString: (): string => {return '0.0.0.0';},
  toBinary: (): string => {return '0';}
};

const cidrinfo01: CIDRInformation = {
  networkPrefix: '74.125.227.8',
  cidrBlock: 29,
  subnetMask: '255.255.255.248',
  wilcardMask: '0.0.0.7',
  broadcastIP: '74.125.227.15',
  minIP: '74.125.227.8',
  maxIP: '74.125.227.15',
  totalIPs: 8
};

const cidrinfo02: CIDRInformation = {
  networkPrefix: '74.125.227.24',
  cidrBlock: 29,
  subnetMask: '255.255.255.248',
  wilcardMask: '0.0.0.7',
  broadcastIP: '74.125.227.31',
  minIP: '74.125.227.24',
  maxIP: '74.125.227.31',
  totalIPs: 8
};

const cidrinfo03: CIDRInformation = {
  networkPrefix: '0.0.0.0',
  cidrBlock: 0,
  subnetMask: '0.0.0.0',
  wilcardMask: '0.0.0.0',
  broadcastIP: '0.0.0.0',
  minIP: '0.0.0.0',
  maxIP: '0.0.0.0',
  totalIPs: 0
};

const cidrinfo04: CIDRInformation = {
  networkPrefix: '74.125.227.29',
  cidrBlock: 32,
  subnetMask: '255.255.255.255',
  wilcardMask: '0.0.0.0',
  broadcastIP: '74.125.227.29',
  minIP: '74.125.227.29',
  maxIP: '74.125.227.29',
  totalIPs: 1
};

const cidr01: CIDR = {
  inputIP: '74.125.227.10',
  inputCIDR: 29,
  ipOctects: oct1,
  cidrInformation: cidrinfo01,
  maxSubnetCount: 6,
  calculateCIDR: (cidr: number) => {return cidrinfo01},
  splitCIDR: (subnetCount: number) => {return [cidrinfo01];}
};

const cidr02: CIDR = {
  inputIP: '74.125.227.29',
  inputCIDR: 29,
  ipOctects: oct2,
  cidrInformation: cidrinfo02,
  maxSubnetCount: 6,
  calculateCIDR: (cidr: number) => {return cidrinfo02;},
  splitCIDR: (subnetCount: number) => {return [cidrinfo02];}
};

const cidr03: CIDR = {
  inputIP: '0.0.0.0',
  inputCIDR: 0,
  ipOctects: oct3,
  cidrInformation: cidrinfo03,
  maxSubnetCount: 0,
  calculateCIDR: (cidr: number) => {return cidrinfo03;},
  splitCIDR: (subnetCount: number) => {return [cidrinfo03];}
};

/**
 * CIDR Unit Tests
 */
describe('CIDR UnitTests', () => {
  test('parseCIDR(string, string)', () => {
    const cidrInfo = CIDRModule.parseCIDR('74.125.227.10', '29');

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr01));
  });

  test('parseCIDR(string, number)', () => {
    const cidrInfo = CIDRModule.parseCIDR('74.125.227.10', 29);

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr01));
  });

  test('parseCIDR(OCTECTS, number)', () => {
    const cidrInfo = CIDRModule.parseCIDR(oct2, 29);

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr02));
  });

  test('parseCIDR(number, number)', () => {
    const cidrInfo = CIDRModule.parseCIDR(1249764125, 29);

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr02));
  });

  test('parseCIDR()', () => {
    const cidrInfo = CIDRModule.parseCIDR();

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr03));
  });

  test('parseCIDR(A)', () => {
    expect(() => {
      const cidrInfo = CIDRModule.parseCIDR('121.32.25.253', 'A');
    }).toThrowError(`\'A\' is an invalid CIDR block value`);
  });

  test('parseCIDR(0.0.0.0, 29)', () => {
    expect(() => {
      const cidrInfo = CIDRModule.parseCIDR('121.32.25.253', 0);
    }).toThrowError(`Must specify CIDR block value for IP \'121.32.25.253\'`);
  });

  test('calculateCIDR() on 0.0.0.0', () => {
    const cidrInfo = CIDRModule.parseCIDR();

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr03));
    expect(() => {
      cidrInfo.calculateCIDR(29);
    }).toThrowError(`Cannot calculate CIDR for \'0.0.0.0\'`);
  });

  test('calculateCIDR(0)', () => {
    const cidrInfo = CIDRModule.parseCIDR();

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr03));
    expect(() => {
      cidrInfo.calculateCIDR(0);
    }).toThrowError(`CIDR block value must be between 1 and 32`);
  });

  test('calculateCIDR(33)', () => {
    const cidrInfo = CIDRModule.parseCIDR();

    expect(cidrInfo).toBeDefined();
    expect(JSON.stringify(cidrInfo)).toEqual(JSON.stringify(cidr03));
    expect(() => {
      cidrInfo.calculateCIDR(33);
    }).toThrowError(`CIDR block value must be between 1 and 32`);
  });

  test('calculateCIDR(32)', () => {
    const cidrInfo = CIDRModule.parseCIDR(oct2, 29);
    const cidrInfo2 = cidrInfo.calculateCIDR(32);

    expect(cidrInfo2).toBeDefined();
    expect(JSON.stringify(cidrInfo2)).toEqual(JSON.stringify(cidrinfo04));
  });
});