fnv-plus
========

Javascript FNV-1a Hashing Algorithm implemented up to 1024 bits

#### 0. Concept
The FNV-1a hash algorithm, often simply called "fnv", disperses hashes
throughout the n-bit hash space with very good randomness, and is very 
fast for reasonable input sizes. 

Use this module to generate unique hash/checksum values for Javascript
strings or objects.

##### Note on naming **fnv-plus**
- I call this module `fnv-plus` because it is the only npm module that
is capable of generating fnv hashes for keyspaces larger than 32 bits. 
- `fnv-plus` is also very well-tested. Many other `fnv` implementations offer no unit
tests to prove they work and are performant.

#### 1. Usage

    var fnv = require('fnv-plus'),
      astring = 'hello world',
      ahash32 = fnv.hash(astring);        // 32-bit hash by default
      ahash64 = fnv.hash(astring, 64);    // 64-bit hash specified

    assert.equal(ahash32.hex(), '0xb23eba32');
    assert.equal(ahash32.str(), '1dgfu42');
    assert.equal(ahash32.dec(), '2990455346');

    assert.equal(ahash64.hex(), '0xa8dd8fbdc2b13ffc');
    assert.equal(ahash64.str(), '2kg3e4gji835o');
    assert.equal(ahash64.dec(), '12168039813402935292');

#### 2. API

- method `fnv.hash(string, bitlength)`
  - Hash a string using the given bit length (32 is default)
  - returns a `FnvHash` object

- object `FnvHash`
  - `str()`
      - Returns the hashed value as an ascii string
  - `hex()`
      - Returns the hashed value as a hexadecimal string
  - `dec()`
      - Returns the hashed value as a decimal string
