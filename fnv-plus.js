/**
 * FNV-1a Hash implementation (32, 64, 128, 256, 512, and 1024 bit)
 * @author Travis Webb <me@traviswebb.com>
 * @see http://tools.ietf.org/html/draft-eastlake-fnv-06
 */
var Fnv = (function () {
  'use strict';

  function bn (v, r) {
    return new BigInteger((v).toString(), r);
  }

  var BigInteger = require('jsbn'),
    default_bitlen = 32,
    fnv_constants = {
      32: {
        prime:  Math.pow(2, 24) + Math.pow(2, 8) + 0x93,
        offset: 0x811C9DC5,
      },
      52: {
        prime:  parseInt(bn(2).pow(bn(40)).add(bn(2).pow(bn(8))).add(bn('b3', 16)), 10),
        offset: parseInt(bn('CBF29CE484222325', 16).shiftRight(12), 10),
        mask:   bn('FFFFFFFFFFFFF', 16)
      },
      64: {
        prime:  bn(2).pow(bn(40)).add(bn(2).pow(bn(8))).add(bn('b3', 16)),
        offset: bn('CBF29CE484222325', 16),
        mask:   bn('FFFFFFFFFFFFFFFF', 16)
      },
      128: {
        prime:  bn(2).pow(bn(88)).add(bn(2).pow(bn(8))).add(bn('3b', 16)),
        offset: bn('6C62272E07BB014262B821756295C58D', 16),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      256: {
        prime:  bn(2).pow(bn(168)).add(bn(2).pow(bn(8))).add(bn('63', 16)),
        offset: bn('DD268DBCAAC550362D98C384C4E576CCC8B1536847B6BBB31023B4C8CAEE0535', 16),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      512: {
        prime:  bn(2).pow(bn(344)).add(bn(2).pow(bn(8))).add(bn('57', 16)),
        offset: bn('B86DB0B1171F4416DCA1E50F309990ACAC87D059C90000000000000000000D21E948F68A34C192F62EA79BC942DBE7CE182036415F56E34BAC982AAC4AFE9FD9', 16),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      1024: {
        prime:  bn(2).pow(bn(680)).add(bn(2).pow(bn(8))).add(bn('8d', 16)),
        offset: bn('0000000000000000005F7A76758ECC4D32E56D5A591028B74B29FC4223FDADA16C3BF34EDA3674DA9A21D9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004C6D7EB6E73802734510A555F256CC005AE556BDE8CC9C6A93B21AFF4B16C71EE90B3', 16),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      }
    };

  function createOffset(seed) {

  }

  function FnvHash (value, bitlen) {
    return {
      bits: bitlen,
      value: value,
      dec: function () {
        return value.toString();
      },
      hex: function () {
        return hexpad(value, bitlen);
      },
      str: function () {
        return value.toString(36);
      }
    };
  }
  
  function hexpad (value, bitlen) {
    var str = value.toString(16),
      pad = '';
    for (var i = 0; i < ((bitlen / 4) - str.length); i++) pad += '0';
    return pad + str;
  }

  function hashGeneric (str, _bitlen) {
    var bitlen = (_bitlen || default_bitlen),
      prime = fnv_constants[bitlen].prime,
      hash = fnv_constants[bitlen].offset,
      mask = fnv_constants[bitlen].mask;

    for (var i = 0; i < str.length; i++) {
      hash = hash.xor(bn(str.charCodeAt(i)))
                 .multiply(prime)
                 .and(mask);
    }
    return new FnvHash(hash, bitlen);
  }

  /**
   * Optimized 32bit-specific implementation. Executes about 5x faster in
   * practice, due to reduced reliance on the BigInteger class and a more clever
   * prime multiplication strategy.
   */
  function hash32 (str) {
    var prime = fnv_constants[32].prime,
      hash = fnv_constants[32].offset;

    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return new FnvHash(hash >>> 0, 32);
  }

  /**
   * Optimized 52bit-specific implementation. Javascript integer space is 2^53,
   * so this is the largest FNV hash space available that can take direct
   * advantage of hardware integer ops.
   */
  function hash52 (str) {
    var prime = fnv_constants[52].prime,
      hash = fnv_constants[52].offset,
      mask = fnv_constants[52].mask;

    for (var i = 0; i < str.length; i++) {
      hash ^= Math.pow(str.charCodeAt(i), 2);
      hash *= prime;
    }

    return new FnvHash(bn(hash).and(mask), 52);
  }

  function constructor (seed) {
    // TODO handle custom seed

    return {
      /**
       * @public
       */
      hash: function (str, _bitlen) {
        if ((_bitlen || default_bitlen) === 32) {
          return hash32(str);
        }
        else if ((_bitlen || default_bitlen) === 52) {
          return hash52(str);
        }
        else {
          return hashGeneric(str, _bitlen);
        }
      }
    };
  }

  return {
    constructor: constructor
  };

})();

module.exports = Fnv.constructor;
