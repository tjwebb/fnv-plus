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
        prime: new BigInteger('0x01000193'),
        offset: new BigInteger('0x811C9DC5')
      },
      64: {
        prime: new BigInteger('0x00000100000001B3'),
        offset: new BigInteger('0xCBF29CE484222325')
      },
      128: {
        prime: new BigInteger('0x0000000001000000000000000000013B'),
        offset: new BigInteger('0x6C62272E07BB014262B821756295C58D')
      },
      256: {
        prime: new BigInteger('0x0000000000000000000001000000000000000000000000000000000000000163'),
        offset: new BigInteger('0xDD268DBCAAC550362D98C384C4E576CCC8B1536847B6BBB31023B4C8CAEE0535')
      },
      512: {
        prime: new BigInteger('0x00000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000157'),
        offset: new BigInteger('0xB86DB0B1171F4416DCA1E50F309990ACAC87D059C90000000000000000000D21E948F68A34C192F62EA79BC942DBE7CE182036415F56E34BAC982AAC4AFE9FD9')
      },
      1024: {
        prime: new BigInteger('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018D'),
        offset: new BigInteger('0x0000000000000000005F7A76758ECC4D32E56D5A591028B74B29FC4223FDADA16C3BF34EDA3674DA9A21D9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004C6D7EB6E73802734510A555F256CC005AE556BDE8CC9C6A93B21AFF4B16C71EE90B3')
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
        return '0x' + value.toString(16);
      },
      base64: function () {
        return value.toString(64);
      },
      str: function () {
        return value.toString(36);
      }
    };
  }

  function shift (hash, bitlen) {
    var hashlen = new BigInteger((hash.bitLength()).toString()),
      rshift = bitlen.max(hashlen.subtract(bitlen));

    return hash.shiftRight(rshift);
  }

  function hashGeneric (str, _bitlen) {
    var bitlen = new BigInteger((_bitlen || default_bitlen).toString()),
      prime = fnv_constants[bitlen].prime,
      offset = fnv_constants[bitlen].offset,
      hash = offset,
      trunc = Math.pow(bitlen, 2);

    for (var i = 0; i < str.length; ++i) {
      hash = hash.xor(new BigInteger(str[i]));
      hash = hash.multiply(prime);
      if (hash.bitLength() >= trunc) {
        hash = shift(hash, bitlen);
      }
    }
    return new FnvHash(shift(hash, bitlen), bitlen);
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
