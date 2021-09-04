/**
 * Node imports
 */

/**
 * SimplyAppDevs imports
 */

/**
 * 3rd party imports
 */
import {default as BitSet} from 'bitset';

// type alias for all
export type IPTUPPLE = [number, number, number, number];
export type IPFORMATS = string | number | IPTUPPLE  | OCTECTS;

/**
 * Octects definition
 */
export interface OCTECTS {
  readonly first: number;
  readonly second: number;
  readonly third: number;
  readonly fourth: number;
  add: (num: number) => OCTECTS;
  substract: (num: number) => OCTECTS;
  toArray: () => IPTUPPLE;
  toString: () => string;
  toBinary: () => string;
}

/**
 * Return defalt or cloned Octects instance
 * @param clone Octect instance to clonef from
 * @returns Return default or cloned instance
 */
function defaultOctects(clone?: OCTECTS): OCTECTS {
  if (clone) {
    return {
      first: clone.first,
      second: clone.second,
      third: clone.third,
      fourth: clone.fourth,
      add: (num: number) => {return defaultOctects(OctectsImpl.add(clone, num));},
      substract: (num: number) => {return defaultOctects(OctectsImpl.substract(clone, num));},
      toArray: (): IPTUPPLE => {return clone.toArray();},
      toBinary: (): string => {return clone.toBinary();},
      toString: (): string => {return clone.toString();}
    } as OCTECTS;
  } else {
    return {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      add: (num: number) => {return defaultOctects(OctectsImpl.add(OCTECTSMIN, num));},
      substract: (num: number) => {return defaultOctects(OctectsImpl.substract(OCTECTSMIN, num));},
      toArray: (): IPTUPPLE => {return [0, 0, 0, 0];},
      toBinary: (): string => {return '00000000000000000000000000000000';},
      toString: (): string => {return '0.0.0.0'}
    } as OCTECTS;
  }
}

/**
 * Octects implementation
 */
class OctectsImpl implements OCTECTS {
  private static MAXOCTECTSNUM: number = 0xFFFFFFFF >>> 0;
  private static IPREGEX: RegExp = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  private static SHIFTVALS: IPTUPPLE = [24, 16, 8, 0];
  private static LENVALS: IPTUPPLE = [8, 16, 24, 32];
  private static ANDVALS: IPTUPPLE = [0xFF000000, 0xFF0000, 0xFF00, 0xFF];

  // private members
  private _first: number = 0;
  private _second: number = 0;
  private _third: number = 0;
  private _fourth: number = 0;

  /**
   * Default constructure
   */
  constructor();

  /**
   * Parse octects from IP string
   * @param ip String IP address format [^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$]
   */
  constructor(ip: string);

  /**
   * Parse octects from number
   * @param ip IP number value
   */
  constructor(ip: number);

  /**
   * Clones from existing octects
   * @param ip IP from array of numbers
   */
  constructor(ip: IPTUPPLE);

  /**
   * Clones from existing octects
   * @param ip Octects
   */
  constructor(ip: OCTECTS);

  /**
   * Creates new OCTECTS instance
   * @param ip IP in either IP string, OCTECTS, or array of number
   */
  constructor(ip?: IPFORMATS) {
    if (ip) {
      if (typeof ip === 'string') {
        const tmpOct = OctectsImpl.octectsFromString(ip);
        this.setOctects(tmpOct.first, tmpOct.second, tmpOct.third, tmpOct.fourth);
      } else if (typeof ip === 'number') {
        const tmpOct = OctectsImpl.numberToOctects(ip);
        this.setOctects(tmpOct.first, tmpOct.second, tmpOct.third, tmpOct.fourth);
      } else if (Array.isArray(ip)) {
        this.setOctects(ip[0], ip[1], ip[2], ip[3]);
      } else {
        // OCTECTS
        this.setOctects(ip.first, ip.second, ip.third, ip.fourth);
      }
    }
  }

  /**
   * Sets octects
   * @param f First octect
   * @param s Second octect
   * @param t Third octect
   * @param h Forth octect
   */
  private setOctects(f: number, s: number, t: number, h: number) {
    // validate before we set
    if ([f, s, t, h].some((octect: number) => {
      return ((octect < 0) || (octect > 255));
    })) {
      throw new Error('One or more octect values are invalid');
    }

    // set
    this._first = f;
    this._second = s;
    this._third = t;
    this._fourth = h;
  }

  /**
   * Gets first octect
   */
  public get first(): number {
    return this._first;
  }

  /**
   * Gets second octect
   */
  public get second(): number {
    return this._second;
  }

  /**
   * Gets third octect
   */
  public get third(): number {
    return this._third;
  }

  /**
   * Gets fourth octect
   */
  public get fourth(): number {
    return this._fourth;
  }

  /**
   * Adds number of IPs to current IP
   * @param num Number of IP to add
   * @returns New resulting OCTECTS
   */
  public add(num: number): OCTECTS {
    return OctectsImpl.add(this, num);
  }

  /**
   * Subtract number of IPs to currrent IP
   * @param num Number of IP to substract
   * @returns New resulting OCTECTS
   */
  public substract(num: number): OCTECTS {
    return OctectsImpl.substract(this, num);
  }

  /**
   * Returns octects as array of number
   * @returns Octects as [first, second, third, forth]
   */
  public toArray(): IPTUPPLE {
    return [this._first, this._second, this._third, this._fourth];
  }

  /**
   * Returns octects as IP string
   * @returns Octects as IP string
   */
  public toString(): string {
    return `${this._first}.${this._second}.${this._third}.${this._fourth}`;
  }

  /**
   * Returns octects as binary string
   * @returns Octects as binary string
   */
  public toBinary(): string {
    // return `${this.formatBinary(this._first)}${this.formatBinary(this._second)}${this.formatBinary(this._third)}${this.formatBinary(this._fourth)}`;
    return `${OctectsImpl.formatBinary(OctectsImpl.octectsToNumber(this))}`;
  }

  /**
   * Converts from IP string to OCTECTS
   * @param ip IP in string format
   * @returns IP as OCTECTS
   */
  static octectsFromString(ip: string): OCTECTS {
    // validate
    ip = ip.trim();

    if (!OctectsImpl.IPREGEX.test(ip)) {
      throw new Error('Invalid IP format');
    }

    // extract
    let octString: string[] = OctectsImpl.IPREGEX.exec(ip)!;

    // remove first item
    octString.splice(0, 1);

    let octs: number[] = octString.map((oct: string): number => {
      return parseInt(oct);
    });

    return new OctectsImpl([octs[0], octs[1], octs[2], octs[3]]);
  }

  /**
   * Returns number for the octects
   * @param octects Octects to convert to decimal
   * @returns Decimal value for octects
   */
  static octectsToNumber(octects: OCTECTS): number {
    // get array
    const octs = octects.toArray();

    return octs.reduce((acc: number, oct: number, ind: number) => {
      return acc | ((oct << OctectsImpl.SHIFTVALS[ind]) >>> 0);
    }, 0) >>> 0;
  }

  /**
   * Returns OCTECTS representation of a number
   * @param num Number to convert to OCTECTS
   * @returns OCTECTS for the number
   */
  static numberToOctects(num: number): OCTECTS {
    // validate
    if (num > OctectsImpl.MAXOCTECTSNUM) {
      throw new Error(`Number ${num} is greater than maximum octects value ${OctectsImpl.MAXOCTECTSNUM}`);
    }

    // AND the number by masks and right shift by the octect bits
    const octs = OctectsImpl.ANDVALS.map((val: number, ind: number) => {
      return (num & val) >>> OctectsImpl.SHIFTVALS[ind];
    });

    // return
    return new OctectsImpl([octs[0], octs[1], octs[2], octs[3]]);
  }

  /**
   * Formats octect in binary string
   * @param octect Octect to format in binary
   * @param separator Optional seperator to use
   * @returns Returns octect in binary string (8 bits)
   */
  static formatBinary(octect: number, separator?: string): string {
    // convert to binary string
    const binString = octect.toString(2);
    const binLen = binString.length;

    // determine the max string length
    let padCount = 0;

    OctectsImpl.LENVALS.forEach((val: number) => {
      if ((binLen <= val) && (padCount === 0)) {
        padCount = val;
      }
    });

    // return
    const fullBinString = binString.padStart(padCount, '0');
    const fillBinStrLen = fullBinString.length;

    separator = separator || '';
    const seps = [separator, separator, separator, ''];

    let startInd = 0;
    let endInd = 0;

    return OctectsImpl.LENVALS.reduce((acc: string, val: number, ind: number) => {
      endInd += 8;

      acc = `${acc}${fullBinString.substring(startInd, endInd)}${seps[ind]}`;

      startInd = endInd;

      return acc;
    }, '');
  }

  /**
   * Adds number of IPs to an IP
   * @param octects Octects to add to
   * @param num Number of IP to add
   * @returns New resulting OCTECTS
   */
  static add(octects: OCTECTS, num: number): OCTECTS {
    // validation
    const curVal = octects.toString();

    if (curVal === '255.255.255.255') {
      throw new Error(`Cannot add to \'${curVal}\'`);
    }

    if (num < 0) {
      throw new Error(`Invalid number \'${num}\' to add`);
    }

    if (num === 0) {
      return new OctectsImpl(octects);
    }

    // convert octects to number
    let octNum = OctectsImpl.octectsToNumber(octects);

    // add it
    octNum += num;

    // validate
    if (octNum > OctectsImpl.MAXOCTECTSNUM) {
      throw new Error(`Resulting value \'${octNum}\' is greater than maximum octects value \'${OctectsImpl.MAXOCTECTSNUM}\'`);
    }

    return new OctectsImpl(OctectsImpl.numberToOctects(octNum));
  }

  /**
   * Subtract number of IPs to an IP
   * @param octects Octects to substract from
   * @param num Number of IP to substract
   * @returns New resulting OCTECTS
   */
  static substract(octects: OCTECTS, num: number): OCTECTS {
    // validation
    const curVal = octects.toString();

    if (curVal === '0.0.0.0') {
      throw new Error(`Cannot substract from \'${curVal}\'`);
    }

    if (num < 0) {
      throw new Error(`Invalid number \'${num}\' to substract`);
    }

    if (num === 0) {
      return new OctectsImpl(octects);
    }

    // covert octects to number
    let octNum = OctectsImpl.octectsToNumber(octects);

    octNum -= num;

    return new OctectsImpl(OctectsImpl.numberToOctects(octNum));
  }
}

// MAX & MIN octects
export const OCTECTSMIN = defaultOctects();
export const OCTECTSMAX = defaultOctects(new OctectsImpl('255.255.255.255'));

/**
 * CIDR information
 */
export interface CIDRInformation {
  readonly networkPrefix: string;
  readonly cidrBlock: number;
  readonly minIP: string;
  readonly maxIP: string;
  readonly subnetMask: string;
  readonly wilcardMask: string;
  readonly broadcastIP: string;
  readonly totalIPs: number;
}

/**
 * Returns default or clone CIDRInformation instance
 * @returns Default CIDRInformation instance
 */
function defaultCIDRInformation(): CIDRInformation {
  return {
    networkPrefix: '0.0.0.0',
    cidrBlock: 0,
    subnetMask: '0.0.0.0',
    wilcardMask: '0.0.0.0',
    broadcastIP: '0.0.0.0',
    minIP: '0.0.0.0',
    maxIP: '0.0.0.0',
    totalIPs: 0
  };
}

/**
 * CIDR definition
 */
export interface CIDR {
  readonly inputIP: string;
  readonly inputCIDR: number;
  readonly ipOctects: OCTECTS;
  readonly cidrInformation: CIDRInformation;
  readonly maxSubnetCount: number;
  calculateCIDR: (cidr: number) => CIDRInformation;
  splitCIDR: (subnetCount: number) => CIDRInformation[];
  toString: () => string;
}

/**
 * Returns default CIDR instance
 * @param clone CIDR instance to clone from
 * @returns Default CIDR instance
 */
function defaultCIDR(clone: CIDR): CIDR {
  return {
    inputIP: clone.inputIP,
    inputCIDR: clone.inputCIDR,
    ipOctects: defaultOctects(clone.ipOctects),
    cidrInformation: clone.cidrInformation,
    maxSubnetCount: clone.maxSubnetCount,
    calculateCIDR: (cidr: number): CIDRInformation => {return clone.calculateCIDR(cidr);},
    splitCIDR: (subnetCount: number): CIDRInformation[] => {return clone.splitCIDR(subnetCount);},
    toString: (): string => {return clone.toString();}
  };
}

/**
 * CIDR implementation
 */
class CIDRImpl implements CIDR {
  // private
  private _octects: OCTECTS = new OctectsImpl();
  private _inputIP: string = this._octects.toString();
  private _inputCIDR: number = 0;

  private _cidrInfo: CIDRInformation = defaultCIDRInformation();
  private _maxSubnetCount: number = 0;
  private _networkBitCount: number = 0;
  private _hostBitCount: number = 0;

  /**
   * Default constructor
   */
  constructor();

  /**
   * Parse octects from IP string
   * @param ip String IP address format [^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$]
   * @param cidr CIDR block
   */
  constructor(ip: string, cidr?: string | number);

  /**
   * Clones from existing octects
   * @param ip Octects
   * @param cidr CIDR block
   */
  constructor(ip: OCTECTS, cidr?: string | number);

  /**
   * Clones from existing octects
   * @param ip IP from array of numbers
   * @param cidr CIDR block
   */
  constructor(ip: number[], cidr?: string | number);

  /**
   * Creates new CIDR instance
   * @param ip IP in either IP string, OCTECTS, or array of number
   * @param cidr CIDR block
   */
  constructor(ip?: string | OCTECTS | number[], cidr?: string | number) {
    if (ip) {
      this._octects = new OctectsImpl(ip as any); // validation of IP happens in here
      this._inputIP = this._octects.toString();
    }

    if (cidr) {
      if (typeof cidr === 'string') {
        const cidrNum = parseInt(cidr);

        if (isNaN(cidrNum)) {
          throw new Error(`\'${cidr}\' is an invalid CIDR block value`);
        }

        this._inputCIDR = cidrNum;
      } else {
        this._inputCIDR = cidr;
      }
    }

    // if we have IP, we need CIDR
    if ((this._inputIP !== '0.0.0.0') && (this._inputCIDR <= 0)) {
      throw new Error(`Must specify CIDR block value for IP \'${this._inputIP}\'`);
    }

    // calculate CIDR
    if ((this._octects.toString() !== '0.0.0.0') && (this._inputCIDR > 0)) {
      this.calculateCIDR(this._inputCIDR);
    }
  }

  /**
   * Converts BitSet to Octects
   * @param bs Bitset to convert
   * @returns Returns Octects representation of the BitSet
   */
  private bitsetToIP(bs: BitSet): OCTECTS {
    // grab every 8bits
    const frh: number = +bs.slice(0, 7).toString(10);
    const thd: number = +bs.slice(8, 15).toString(10);
    const sec: number = +bs.slice(16, 23).toString(10);
    const fst: number = +bs.slice(24, 31).toString(10);

    return new OctectsImpl([fst, sec, thd, frh]);
  }

  /**
   * Gets IP that was used to initialize this instance
   */
  get inputIP(): string {
    return this._inputIP;
  };

  /**
   * Gets IP that was used to initialize this instance
   */
  get inputCIDR(): number {
    return this._inputCIDR;
  };

  /**
   * Gets octects
   */
  get ipOctects(): OCTECTS {
    return this._octects;
  }

  /**
   * Gets CIDRInformation (last successful calculation)
   */
  get cidrInformation(): CIDRInformation {
    return this._cidrInfo;
  }

  /**
   * Gets the maximum number of subnet that this CIDR can be split into
   */
  get maxSubnetCount(): number {
    return this._maxSubnetCount;
  }

  /**
   * Calculate CIDR information based on CIDR block
   * @param cidr CIDR block
   */
  public calculateCIDR(cidr: number): CIDRInformation {
    // CIDR is between 1-32
    if ((cidr < 1) || (cidr > 32)) {
      throw new Error(`CIDR block value must be between 1 and 32`);
    }

    if (this._octects.first === 0) {
      throw new Error(`Cannot calculate CIDR for \'${this.inputIP}\'`);
    }

    // IP consists of 4x 8bits octects
    // each octect range is 0 - 255
    // CIDR block value indicates which top N bits to "lock" (unchangble) based on the input IP
    // for example:
    // IP := 172.90.0.2 and CIDR := 8 - that means 172 is locked while the last 3 octects (24bits) can change

    // bitset for CIDR block
    const cidrBS = new BitSet('0xffffffff');

    // calculate the lower bits that can change
    let varBits = 32 - cidr;

    this._networkBitCount = cidr;
    this._hostBitCount = varBits;

    if (varBits > 0) {
      varBits -= 1; // 0 based array index
      cidrBS.setRange(0, varBits, 0);
    }

    // bitset for input IP
    const inputIPBS = new BitSet(`${this.ipOctects.toBinary()}`);

    // netmask - AND inputIP and CIDR block
    const lockedCIDR = inputIPBS.and(cidrBS);

    // minimum IP is just the locked CIDR block (this is also the network prefix)
    const minIP: string = this.bitsetToIP(lockedCIDR).toString();

    // maximum IP is lockedCIDR block but with the lower 32-cidr bits flipped
    const maxIPBS = lockedCIDR.clone();
    maxIPBS.flip(0, 31 - cidr);

    const maxIP = this.bitsetToIP(maxIPBS).toString();

    // maximum # of IP 2^N where N is the # of lower bits that can change
    const maxIPCount = Math.pow(2, 32 - cidr);

    // wildcard address is NOT of netmask
    const wilcardMask = cidrBS.clone().not();

    // save result
    this._inputCIDR = cidr;
    this._maxSubnetCount = Math.pow(2, this._hostBitCount) - 2;

    this._cidrInfo = {
      networkPrefix: minIP,
      cidrBlock: this.inputCIDR,
      subnetMask: `${this.bitsetToIP(cidrBS).toString()}`,
      wilcardMask: `${this.bitsetToIP(wilcardMask).toString()}`,
      broadcastIP: maxIP,
      minIP: minIP,
      maxIP: maxIP,
      totalIPs: maxIPCount
    };

    return this._cidrInfo;
  }

  /**
   * Returns subnet segments for the current CIDR
   * @param subnetCount Number of subnets to split from the current CIDR
   */
  public splitCIDR(subnetCount: number): CIDRInformation[] {
    // validate
    if ((this._inputIP === '0.0.0.0') || (this._inputCIDR === 0)) {
      throw new Error('Cannot split CIDR because it has not been defined.');
    }

    if (subnetCount <= 1) {
      return [this._cidrInfo];
    }

    if (this._hostBitCount === 0) {
      return [];
    }

    if (subnetCount > this.maxSubnetCount) {
      throw new Error(`CIDR can only be split into maximum of \'${this.maxSubnetCount}\' subnets.`);
    }

    // subnetting takes the available host bits and lock N high order bits
    // to use as network bits (in addtional to the CIDR network bits)
    // so we need to find the max bits we need to reserve for the subnetting
    // formula: 2^N >= subnetCount - find N that result to subnetCount or the next
    // one greater than subnetCount
    let realSubnetCount = 0;
    let n = 0;

    while (realSubnetCount === 0) {
      const subCount = Math.pow(2, n);

      if (subCount >= subnetCount) {
        realSubnetCount = subCount;
      } else {
        ++n;
      }
    }

    // new CIDR
    let newCIDR = this._cidrInfo.cidrBlock + n;

    // loop to calculate subnets
    let subnets: CIDRInformation[] = [];

    let startIP: string = this._cidrInfo.minIP;
    let startIPOctects: OCTECTS = new OctectsImpl(startIP);

    for (let i = 0; i < realSubnetCount; i++) {
      // subnet using startIP but new CIDR
      subnets[i] = new CIDRImpl(startIP, newCIDR).cidrInformation;

      // next start IP is current subnet maxIP + 1
      startIPOctects = new OctectsImpl(subnets[i].maxIP);
      startIPOctects = startIPOctects.add(1);

      startIP = startIPOctects.toString();
    }

    return subnets;
  }

  /**
   * Return string representation of this instance
   * @returns String representation of this CIDR instance
   */
  public toString(): string {
    return `${this._inputIP}/${this.inputCIDR}`;
  }

  /**
   * Returns CIDR block based on subnet mask
   * @param mask Subnet mask
   */
  static cidrBlockFromSubnetMask(mask: string): number {
    // convert to octects
    const maskOctects = new OctectsImpl(mask);

    // bitset
    const maskBS = new BitSet(maskOctects.toBinary());

    if (maskBS.toString(10) === '0') {
      throw new Error(`\'${mask}\' is not a valid subnet mask value`);
    }

    // subnet mask cannot have 0 in between 1s
    const bits = maskBS.toString(2);
    if (/01/.test(bits)) {
      throw new Error(`\'${mask}\' is not a valid subnet mask format`);
    }

    // get the last 0s
    const zeroBits = /(0+)/.exec(bits);

    if (!zeroBits) {
      // all 1s
      return 32;
    } else {
      // regex match - first item is the full matched text and subsequent items are the groups
      // in this case it has to be a match and the first item is all the 0s
      return 32 - zeroBits[0].length;
    }
  }
}

/**
 * CIDR module
 */
export const CIDRModule = {
  parseCIDR: (ip?: IPFORMATS, cidr?: string | number): CIDR => {
    return defaultCIDR(new CIDRImpl(ip as any, cidr));
  },
  parseOctects: (ip: IPFORMATS): OCTECTS => {
    return defaultOctects(new OctectsImpl(ip as any));
  },
  cidrFromSubnetMask: (mask: string): number => {
    return CIDRImpl.cidrBlockFromSubnetMask(mask);
  },
  octectsFromIPString: (ip: string): OCTECTS => {
    return defaultOctects(OctectsImpl.octectsFromString(ip));
  },
  octectsToNumber: (octs: OCTECTS): number => {
    return OctectsImpl.octectsToNumber(octs);
  },
  numberToBinary: (num: number, sep?: string): string => {
    return OctectsImpl.formatBinary(num, sep);
  },
  addToIP: (ip: IPFORMATS, num: number): OCTECTS => {
    const octs = new OctectsImpl(ip as any);

    return defaultOctects(octs.add(num));
  },
  substractFromIP: (ip: IPFORMATS, num: number): OCTECTS => {
    const octs = new OctectsImpl(ip as any);

    return defaultOctects(octs.substract(num));
  }
};
