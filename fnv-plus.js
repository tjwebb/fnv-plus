/**
 * FNV-1a Hash implementation (32, 64, 128, 256, 512, and 1024 bit)
 * @author Travis Webb <me@traviswebb.com>
 * @see http://tools.ietf.org/html/draft-eastlake-fnv-06#section-2.1
 */
var fnv = (function () {
  'use strict';

  var BigInteger = require('jsbn'),
    default_bitlen = 32,
    fnv_constants = {
      32: {
        prime:  new BigInteger('01000193', 16),
        offset: new BigInteger('811C9DC5', 16),
        mask:   new BigInteger('FFFFFFFF', 16)
      },
      64: {
        prime:  new BigInteger('00000100000001B3', 16),
        offset: new BigInteger('CBF29CE484222325', 16),
        mask:   new BigInteger('FFFFFFFFFFFFFFFF', 16)
      },
      128: {
        prime:  new BigInteger('0000000001000000000000000000013B', 16),
        offset: new BigInteger('6C62272E07BB014262B821756295C58D', 16),
        mask:   new BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      256: {
        prime:  new BigInteger('0000000000000000000001000000000000000000000000000000000000000163', 16),
        offset: new BigInteger('DD268DBCAAC550362D98C384C4E576CCC8B1536847B6BBB31023B4C8CAEE0535', 16),
        mask:   new BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      512: {
        prime: new  BigInteger('00000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000157', 16),
        offset: new BigInteger('B86DB0B1171F4416DCA1E50F309990ACAC87D059C90000000000000000000D21E948F68A34C192F62EA79BC942DBE7CE182036415F56E34BAC982AAC4AFE9FD9', 16),
        mask:   new BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      },
      1024: {
        prime: new  BigInteger('000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018D', 16),
        offset: new BigInteger('0000000000000000005F7A76758ECC4D32E56D5A591028B74B29FC4223FDADA16C3BF34EDA3674DA9A21D9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004C6D7EB6E73802734510A555F256CC005AE556BDE8CC9C6A93B21AFF4B16C71EE90B3', 16),
        mask:   new BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
      }
    };

  function FnvHash (value, bitlength) {
    return {
      bitlength: bitlength,
      value: value,
      dec: function () {
        return value.toString();
      },
      hex: function () {
        return value.toString(16);
      },
      str: function () {
        return value.toString(36);
      }
    };
  }

  function hashGeneric (str, _bitlen) {
    var bitlen = new BigInteger((_bitlen || default_bitlen).toString(), 10),
      prime = fnv_constants[bitlen].prime,
      offset = fnv_constants[bitlen].offset,
      mask = fnv_constants[bitlen].mask,
      hash = offset,
      trunc = Math.pow(bitlen, 2);

    for (var i = 0; i < str.length; i++) {
      hash = hash.xor(new BigInteger(str.charCodeAt(i).toString(), 10))
                 .multiply(prime)
                 .and(mask);
    }
    return new FnvHash(hash, bitlen);
  }

  return {

    /**
     * @public
     */
    hash: function (str, _bitlen) {
      return hashGeneric(str, _bitlen);
    }
  };
})();

module.exports = fnv;
