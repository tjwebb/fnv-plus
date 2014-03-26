fnv-plus
========

[![Build Status](https://travis-ci.org/tjwebb/fnv-plus.png?branch=master)](https://travis-ci.org/tjwebb/fnv-plus)

Javascript FNV-1a Hashing Algorithm up to 1024 bits, with highly optimized 32bit and 52bit implementations.

## 0. Concept
The FNV-1a hash algorithm, often simply called "fnv", disperses hashes
throughout the n-bit hash space with very good dispersion and is very 
fast.

Use this module to generate unique hash/checksum values for Javascript
strings or objects. **Note:** The FNV-1a algorithm is not even remotely suitable as
a cryptographic pseudo-random generator, and should not be used to secure any
thing for any reason. It is designed for *uniqueness*, not *randomness*.

##### Why **fnv-plus**?
- I call this module `fnv-plus` because it is the only npm module that
  is capable of generating fnv hashes for keyspaces larger than 32 bits. 
- `fnv-plus` is well-tested. Many other fnv implementations offer no unit tests
  to prove they work and are performant.
- `fnv-plus` implements a 52bit version of FNV-1a which provides a larger
  hash space while still making use of Javasript's 53-bit integer space.

##### New in 1.2.x
- You can easily define custom seeds. Most other fnv implementations hardcode
  the fnv offset.
- the `hash()` function can now take arbitrary Javascript objects as input.
- changed default bitlength to **52**

## 1. Usage

    var fnv = require('fnv-plus'),
      astring = 'hello world',
      ahash32 = fnv.hash(astring),        // 32-bit hash by default
      ahash64 = fnv.hash(astring, 64);    // 64-bit hash specified

    assert.equal(ahash32.hex(), '0xb23eba32');
    assert.equal(ahash32.str(), '1dgfu42');
    assert.equal(ahash32.dec(), '2990455346');

    assert.equal(ahash64.hex(), '0xa8dd8fbdc2b13ffc');
    assert.equal(ahash64.str(), '2kg3e4gji835o');
    assert.equal(ahash64.dec(), '12168039813402935292');

    fnv.seed('fobar testseed');
    assert.notEqual(fnv.hash(astring), ahash64);
    // ^^ because the default seed is not 'foobar testseed'

## 2. API

- method `fnv.hash(string, bitlength)`
  - Hash a string using the given bit length (52 is default)
  - returns a `FnvHash` object


- method `fnv.seed(string)`
  - Seed the algorithm to produce different values. Hashing the same value with
    different seeds will very likely result in different results. To the extent
    your seed can be random, it can serve as a source of randomness, but
    nonetheless is *not* a replacement for a crypgographic PRG (pseudo-random
    generator).
  - default seed is the URL of this repository


- object `FnvHash`
  - `str()`
      - Returns the hashed value as an ascii string
  - `hex()`
      - Returns the hashed value as a hexadecimal string
  - `dec()`
      - Returns the hashed value as a decimal string

## 3. Contribute!
- File a bug or feature request: https://github.com/tjwebb/fnv-plus/issues
- I `<3` pull requests
