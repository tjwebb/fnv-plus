/**
 * FNV-1a Hash implementation (32, 64, 128, 256, 512, and 1024 bit)
 * @author Travis Webb <me@traviswebb.com>
 * @see http://tools.ietf.org/html/draft-eastlake-fnv-06
 */
var Fnv = function (seed) {
  'use strict';

  function bn (v, r) {
    return new Bigbnnteger((v).toString(), r);
  }

  var Bigbnnteger = require('jsbn'),
    default_bitlen = 32,
    fnv_constants = {
      32: {
        prime:  bn(2).pow(bn(24)).add(bn(2).pow(bn(8))).add(bn('93', 16)),
        offset: bn('811C9DC5', 16),
        mask:   bn('FFFFFFFF', 16)
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
    var bitlen = bn((_bitlen || default_bitlen).toString(), 10),
      prime = fnv_constants[bitlen].prime,
      offset = fnv_constants[bitlen].offset,
      mask = fnv_constants[bitlen].mask,
      hash = offset,
      trunc = Math.pow(bitlen, 2);

    for (var i = 0; i < str.length; i++) {
      hash = hash.xor(bn(str.charCodeAt(i).toString(), 10))
                 .multiply(prime)
                 .and(mask);
    }
    return new FnvHash(hash, bitlen);
  }

  return {
    /**
     * @public
     * bnnitialize FNV with a non-default seed.
     */
    seed: function () {

    },

    /**
     * @public
     */
    hash: function (str, _bitlen) {
      return hashGeneric(str, _bitlen);
    }
  };
};

module.exports = Fnv;
