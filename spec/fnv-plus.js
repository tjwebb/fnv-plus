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
    generations = [ 1, 64, 1*K, 2*K, 4*K, 8*K, 16*K, 32*K, 128*K ],
    gentime,
    ascii = { },

    /**
     * Max allowable time in ms to hash 1kb of data with 32-bit fnv. Used to 
     * compute derivative benchmarks for other payload sizes and bitlengths.
     */
    t = 10,

    performant = function (g, bitlen) {
      var r = (generations[g] / generations[0]),
        x = Math.pow((bitlen / 32), 2) * t * r;
      //console.log('gen: '+ g + ' bitlen: '+ bitlen +' max: '+ x);
      return x;
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
    }
    gentime = new Date().valueOf() - t1;
  });

  it('should generate test data', function () {
    for (var g = 0; g < generations.length; g++) {
      assert(ascii[g].length >= generations[g], 'test data of insufficient size');
    }
  });

  describe('#hash()', function () {
    describe('32bit', function () {
      it('should generate a 32-bit hash by default', function () {
        var h1 = fnv.hash(hash1),
            h2 = fnv.hash(hash2),
            h3 = fnv.hash(generate());

        assert.equal(h1.hex(), '0xb23eba32');
        assert.equal(h2.hex(), '0xa0714758');
        assert.ok(h3.hex());
      });
      it('should be performant', function () {
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

        assert.equal(h1.hex(), '0xa8dd8fbdc2b13ffc');
        assert.equal(h2.hex(), '0xc8827d2b104f80f8');
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

        assert.equal(h1.hex(), '0x9176e616dd2a39b6cfdc008d3c72874e');
        assert.equal(h2.hex(), '0x99397cec4c8bc61a4723614a0f5c9dad');
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

        assert.equal(h1.hex(), '0xe44e1bcf4297098f75a6cfed56748388180838c1ebb0341e8c35cd4d6511ee4a');
        assert.equal(h2.hex(), '0xbd40ac089a517f6754d970f7b08174bfbed9118ce48ddd3c77f647ef04174b2e');
        assert.ok(h3.hex());
      });
      it('should be performant **256bit hash performance degrades quickly on > 32k message size**', function () {
        for (var g = 0; g < 6; g++) {
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

        assert.equal(h1.hex(), '0x85ecd1f224bd4d123143be2910e940a8814d07413f32e085b6c39c8aa372cd197934018aeed1eab9697d228a34190e02e43306c1dd298b7453bc11919cc1a537');
        assert.equal(h2.hex(), '0x89820672e3e4e6a97f21efcd0854a49318e0eacb7fcea60776e9e0ea7de9a4e7053c716a0c9554bed99b1274a5d0c109650f3a63d4e11d149c6f4bad6e94390b');
        assert.ok(h3.hex());
      });
      it('should be performant **512bit hash performance degrades quickly on > 8k message size**', function () {
        for (var g = 0; g < 4; g++) {
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

        assert.equal(h1.hex(), '0xb47f6b962cd72efe569e7914ee6b160f9972c32d690d989cbda4430aaf849173e4a6b504ba7e31384d8709d150e33c28dd784e61c0747eef5f43137520529e748f727ab2f31ba53d0c0cf478a462562f5a6863fa2b57d45101f89dcd0589dc116ce452ac6adde0a200a297ac62da1c4189f116553eceff448318e30897c5b1b0');
        assert.equal(h2.hex(), '0x8e29b958ddf0a3c522c2f2253023c79e4a8c533f5d2e7d175b0591a522f9b7382f37c287abe7d63268957e1da47885a810634b06774ac23b7e15fea63d7454e40402ca98ba34c88f53fad34192ef015f430185136419e7fb24f5262084510678087864e569e068305d2815593ec4191a01bcd157dfca4ce9c52ac6bd638b7e94');
        assert.ok(h3.hex());
      });
      it('should be performant **1024bit hash performance degrades quickly on > 1k message size**', function () {
        for (var g = 0; g < 2; g++) {
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
      assert.equal(h1.str(), '1dgfu42');
      assert.equal(h2.str(), '18im5i0');

      assert.equal(h3.str(), '2kg3e4gji835o');
      assert.equal(h4.str(), '31rr8j2d719fc');
    });
    it('#hex()', function () {
      assert.equal(h1.hex(), '0xb23eba32');
      assert.equal(h2.hex(), '0xa0714758');

      assert.equal(h3.hex(), '0xa8dd8fbdc2b13ffc');
      assert.equal(h4.hex(), '0xc8827d2b104f80f8');
    });
    it('#dec()', function () {
      assert.equal(h1.dec(), '2990455346');
      assert.equal(h2.dec(), '2691778392');

      assert.equal(h3.dec(), '12168039813402935292');
      assert.equal(h4.dec(), '14448248178468684024');
    });
  });
});
