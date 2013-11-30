/* jshint expr:true */
var fnv = require('../fnv-plus'),
  assert = require('chai').assert;

describe('fnv-plus', function () {
  var K = 1024,
      M = K * K,
    hash1 = 'hello world',
    hash2 = 'the quick brown fox jumps over the lazy dog',
    generate = function () {
      return {
        foo: 'bar',
        hello: {
          bar: 'world',
          baz: [1,2,3,4],
          random: Math.random() * 100000
        },
        '0x123': {
          makes: 'no sense !@#$%^&*()_+'
        },
        alice: function () {
          return 'bob';
        },
        text: 'the quick '+ (Math.random() * 10).toString(36) + 'brown fox',
        moretext: 'lorem ipsum total random junk 23i2jnlkwjbflksdbf'
      };
    },
    generations = [ 1, 1*K, 2*K, 4*K, 8*K, 16*K, 32*K, 128*K, 1*M ],
    gentime,
    ascii = { },

    /**
     * Max allowable time in ms to hash 1kb of data with 32-bit fnv. Used to 
     * compute derivative benchmarks for other payload sizes and bitlengths.
     */
    t = 2,

    performant = function (g, bitlen) {
      var a = 50, // overhead,
        r = (generations[g] / generations[1]),
        x = Math.pow((bitlen / 32), 2) * t * Math.max(r, 1);
      return x + a;
    };

  // generate a bunch of ascii data
  before(function () {
    var data = { },
      t1 = new Date().valueOf();

    for (var g = 0; g < generations.length; g++) {
      data[g] || (data[g] = [ ]);
      ascii[g] = '';

      while (ascii[g].length <= generations[g]) {
        data[g].push(generate());
        ascii[g] += JSON.stringify(data[g]);
      }
      ascii[g].slice(0, generations[g] - 1);
      assert(ascii[g].length >= generations[g], 'test data of insufficient size');
    }
    gentime = new Date().valueOf() - t1;
  });

  for (var g = 0; g < generations.length; g++) {
    it('generated '+ (generations[g] / K).toFixed(0) +'k of test data');
  }

  describe('#hash()', function () {
    describe('32bit', function () {
      it('should generate a 32-bit hash by default', function () {
        var h1 = fnv.hash(hash1),
            h2 = fnv.hash(hash2),
            h3 = fnv.hash(generate());

        assert.equal(h1.hex(), 'd58b3fa7');
        assert.equal(h2.hex(), 'ef693ff0');
        assert.ok(h3.hex());
      });
      it('32-bit should be performant', function () {
        for (var g = 0; g < generations.length; g++) {
          var t1 = new Date().valueOf(),
            t2, max;
          fnv.hash(ascii[g]);
          t2 = new Date().valueOf();
          actual = t2 - t1;
          max = performant(g, 32);

          //console.log('32bit actual: '+ actual);

          assert(actual < max, 'actual time in ms: '+ actual +' ; max allowed: '+ max);
        }
      });
    });
    describe('64bit', function () {
      it('should generate a 64-bit hash if specified', function () {
        var h1 = fnv.hash(hash1, 64),
            h2 = fnv.hash(hash2, 64),
            h3 = fnv.hash(generate(), 64);

        assert.equal(h1.hex(), '779a65e7023cd2e7');
        assert.equal(h2.hex(), '7404cea13ff89bb0');
        assert.ok(h3.hex());
      });
      it('should be performant', function () {
        for (var g = 0; g < generations.length; g++) {
          var t1 = new Date().valueOf(),
            t2, max;
          fnv.hash(ascii[g], 64);
          t2 = new Date().valueOf();
          actual = t2 - t1;
          max = performant(g, 64);

          //console.log('64bit actual: '+ actual);

          assert(actual < max, 'actual time in ms: '+ actual +' ; max allowed: '+ max);
        }
      });
    });
    describe('128bit', function () {
      it('should generate a 128-bit hash if specified', function () {
        var h1 = fnv.hash(hash1, 128), 
            h2 = fnv.hash(hash2, 128),
            h3 = fnv.hash(generate(), 128);

        assert.equal(h1.hex(), '6c155799fdc8eec4b91523808e7726b7');
        assert.equal(h2.hex(), '577ea59947cc87c26ffa73dd35a3f550');
        assert.ok(h3.hex());
      });
      it('should be performant', function () {
        for (var g = 0; g < generations.length; g++) {
          var t1 = new Date().valueOf(),
            t2, max;
          fnv.hash(ascii[g], 128);
          t2 = new Date().valueOf();
          actual = t2 - t1;
          max = performant(g, 128);

          //console.log('128bit actual: '+ actual);

          assert(actual < max, 'actual time in ms: '+ actual +' ; max allowed: '+ max);
        }
      });
    });
    describe('256bit', function () {
      it('should generate a 256-bit hash if specified', function () {
        var h1 = fnv.hash(hash1, 256),
            h2 = fnv.hash(hash2, 256),
            h3 = fnv.hash(generate(), 256);

        assert.equal(h1.hex(), 'ecc3cf2e0edfccd3d87f21ec0883aad4db43eead66ce09eb4a97e04e1a184527');
        assert.equal(h2.hex(), '19395122fd2327ae0ddc5e67d8c001f4b93c6e35d422c6c62813d6cf60a77dd0');
        assert.ok(h3.hex());
      });
      it('should be performant', function () {
        for (var g = 0; g < generations.length; g++) {
          var t1 = new Date().valueOf(),
            t2, max;
          fnv.hash(ascii[g], 256);
          t2 = new Date().valueOf();
          actual = t2 - t1;
          max = performant(g, 256);

          //console.log('256bit actual: '+ actual);

          assert(actual < max, 'actual time in ms: '+ actual +' ; max allowed: '+ max);
        }
      });
    });
    describe('512bit', function () {
      it('should generate a 512-bit hash if specified', function () {
        var h1 = fnv.hash(hash1, 512),
            h2 = fnv.hash(hash2, 512),
            h3 = fnv.hash(generate(), 512);

        assert.equal(h1.hex(), '2b9c19ec56ccf98da0f227cc82bfaacbd8350928bd2ceacae7bc8aa13e747f5c43ca4e2e98fc25e94e4e805675545ee95a3b968c0acfaecb90aea2fdbcd4de0f');
        assert.equal(h2.hex(), '881463aa6428ced46b62d3702311d326af7dcff79deb64d3f0a1a7eec2957f6718f2ade6cf47d266433f38e535a9760ef62c7c27184809d83b0f2b2a8d9d69d8');
        assert.ok(h3.hex());
      });
      it('should be performant', function () {
        for (var g = 0; g < generations.length; g++) {
          var t1 = new Date().valueOf(),
            t2, max;
          fnv.hash(ascii[g], 512);
          t2 = new Date().valueOf();
          actual = t2 - t1;
          max = performant(g, 512);

          //console.log('512bit actual: '+ actual);

          assert(actual < max, 'actual time in ms: '+ actual +' ; max allowed: '+ max);
        }
      });
    });
    describe('1024bit', function () {
      it('should generate a 1024-bit hash if specified', function () {
        var h1 = fnv.hash(hash1, 1024),
            h2 = fnv.hash(hash2, 1024),
            h3 = fnv.hash(generate(), 1024);

        assert.equal(h1.hex(), '3fa9d253e52ae80105b382c80a01e27a53d7bc1d201efb47b38f4d6e465489829d7d272127d20e1076129c00000000000000000000000000000000000000000000000000000000000000000000000000000253eb20f42a7228af9022d9f35ece5bb71e40fcd8717b80d164ab921709996e5c43aae801418e878cddf968d4616f');
        assert.equal(h2.hex(), '3a13c61b1e04c267aa85cf164e8c9d7c5b2ab14e34c846455bc878e818913e603d5c5a3183a7a82129d420000000002c78c4ffbd2756340f2832a6ab43a50f84596efc9c7ce1ea25ed87cfae6f961834673b91c1f6cf8ee52e689d7188f061f5ac75c344e122b851daa50168b1b854ded8e8ed3bb94747c596e9a13b28ee2220');
        assert.ok(h3.hex());
      });
      it('should be performant', function () {
        for (var g = 0; g < generations.length; g++) {
          var t1 = new Date().valueOf(),
            t2, max;
          fnv.hash(ascii[g], 1024);
          t2 = new Date().valueOf();
          actual = t2 - t1;
          max = performant(g, 1024);

          //console.log('1024 actual: '+ actual);

          assert(actual < max, 'actual time in ms: '+ actual +' ; max allowed: '+ max);
        }
      });
    });
  });
  describe('FnvHash', function () {

    var h1, h2;

    before(function () {
      h1 = fnv.hash(hash1),
      h2 = fnv.hash(hash2);
      h3 = fnv.hash(hash1, 64),
      h4 = fnv.hash(hash2, 64);
    });

    it('#str()', function () {
      var h1 = fnv.hash(hash1);
      assert.equal(h1.str(), '1n91413');
      assert.equal(h2.str(), '1ufesq8');

      assert.equal(h3.str(), '1th7cxzlyc0dj');
      assert.equal(h4.str(), '1rik8q0d89h9s');
    });
    it('#hex()', function () {
      assert.equal(h1.hex(), 'd58b3fa7');
      assert.equal(h2.hex(), 'ef693ff0');

      assert.equal(h3.hex(), '779a65e7023cd2e7');
      assert.equal(h4.hex(), '7404cea13ff89bb0');
    });
    it('#dec()', function () {
      assert.equal(h1.dec(), '3582672807');
      assert.equal(h2.dec(), '4016652272');

      assert.equal(h3.dec(), '8618312879776256743');
      assert.equal(h4.dec(), '8360034000264797104');
    });
  });
});
