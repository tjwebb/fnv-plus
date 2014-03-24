/**
 * FNV-1a Hash implementation (32, 64, 128, 256, 512, and 1024 bit)
 * @author Travis Webb <me@traviswebb.com>
 * @see http://tools.ietf.org/html/draft-eastlake-fnv-06
 */
(function () {
  'use strict';

  var fnvplus = exports;

  var BigInteger = require('jsbn'),
    default_seed = 'https://github.com/tjwebb/fnv-plus';

  var default_keyspace = 52,
    fnv_constants = {
      32: {
        prime:  Math.pow(2, 24) + Math.pow(2, 8) + 0x93,
        offset: 0,
      },
      52: {
        // the 52-bit FNV prime happens to be the same as the 64-bit prime,
        // since it only uses 40 bits.
        prime:  parseInt(bn(2).pow(bn(40)).add(bn(2).pow(bn(8))).add(bn('b3', 16)), 10),
        offset: 0,
        mask:   bn('FFFFFFFFFFFFF', 16)
      },
      64: {
        prime:  bn(2).pow(bn(40)).add(bn(2).pow(bn(8))).add(bn('b3', 16)),
        offset: bn(0, 10),
        mask:   bn('FFFFFFFFFFFFFFFF', 16)
      },
      128: {
        prime:  bn(2).pow(bn(88)).add(bn(2).pow(bn(8))).add(bn('3b', 16)),
        offset: bn(0, 10),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      256: {
        prime:  bn(2).pow(bn(168)).add(bn(2).pow(bn(8))).add(bn('63', 16)),
        offset: bn(0, 10),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      512: {
        prime:  bn(2).pow(bn(344)).add(bn(2).pow(bn(8))).add(bn('57', 16)),
        offset: bn(0, 10),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      1024: {
        prime:  bn(2).pow(bn(680)).add(bn(2).pow(bn(8))).add(bn('8d', 16)),
        offset: bn(0, 10),
        mask:   bn('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      }
    };

  /**
   * @private
   */
  function bn (v, r) {
    return new BigInteger((v).toString(), r);
  }

  function FnvHash (value, keyspace) {
    return {
      bits: keyspace,
      value: value,
      dec: function () {
        return value.toString();
      },
      hex: function () {
        return hexpad(value, keyspace);
      },
      str: function () {
        return value.toString(36);
      }
    };
  }
  
  function hexpad (value, keyspace) {
    var str = value.toString(16),
      pad = '';
    for (var i = 0; i < ((keyspace / 4) - str.length); i++) pad += '0';
    return pad + str;
  }

  function hashGeneric (str, _keyspace) {
    var keyspace = (_keyspace || default_keyspace),
      prime = fnv_constants[keyspace].prime,
      hash = fnv_constants[keyspace].offset,
      mask = fnv_constants[keyspace].mask;

    for (var i = 0; i < str.length; i++) {
      hash = hash.xor(bn(str.charCodeAt(i)))
                 .multiply(prime)
                 .and(mask);
    }
    return new FnvHash(hash, keyspace);
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

    //return new FnvHash(bn(hash).and(mask), 52);
    return new FnvHash(bn(hash).and(mask), 52);
  }

  /**
   * Compute the hash of a given value.
   * @param message the value to hash
   * @public
   */
  fnvplus.hash = function (message, _keyspace) {
    var str = (typeof message === 'object') ? JSON.stringify(message) : message;

    if ((_keyspace || default_keyspace) === 32) {
      return hash32(str);
    }
    else if ((_keyspace || default_keyspace) === 52) {
      return hash52(str);
    }
    else {
      return hashGeneric(str, _keyspace);
    }
  };

  /**
   * @public
   */
  fnvplus.setKeyspace = function (keyspace) {
    default_keyspace = keyspace;
  };

  /**
   * Seed the hash algorithm with some value; this determines the offset that
   * is used.
   * @public
   */
  fnvplus.seed = function (seed) {
    for (var keysize in fnv_constants) {
      fnv_constants[keysize].offset = keysize >= 64 ? bn(0, 10) : 0;

      var offset = fnvplus.hash(seed || default_seed, parseInt(keysize, 10)).dec();
      fnv_constants[keysize].offset = keysize >= 64 ? bn(offset, 10) : offset;
    }
  };

  fnvplus.seed();

})();
