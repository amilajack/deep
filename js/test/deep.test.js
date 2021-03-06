// Generated by CoffeeScript 1.6.3
(function() {
  var assert, deep, testHelper, _;

  _ = require('underscore');

  assert = require('assert');

  testHelper = require('./test_helper');

  deep = require('../lib/deep');

  describe('deep module', function() {
    describe('isPlainObject()', function() {
      it('object literals are plain objects', function(done) {
        assert(deep.isPlainObject({}));
        return done();
      });
      it('objects created with `new Object` are plain objects', function(done) {
        assert(deep.isPlainObject(new Object));
        return done();
      });
      it('global is a plain object', function(done) {
        assert(deep.isPlainObject(global));
        return done();
      });
      it('arrays are not plain objects', function(done) {
        assert(!deep.isPlainObject([]));
        return done();
      });
      it('functions are not plain objects', function(done) {
        assert(!deep.isPlainObject(function() {}));
        return done();
      });
      it('Buffers are not plain objects', function(done) {
        assert(!deep.isPlainObject(new Buffer(1)));
        return done();
      });
      return it('Custom objects are not plain objects', function(done) {
        var Foobar;
        Foobar = function() {};
        assert(!deep.isPlainObject(new Foobar));
        return done();
      });
    });
    describe('clone()', function() {
      beforeEach(function(done) {
        var Foobar;
        Foobar = (function() {
          function Foobar() {}

          return Foobar;

        })();
        this.original = {
          arr: [
            function(arg) {
              return "Hello " + arg + "!";
            }, 'hello!', 1, new Buffer(1), {
              foo: 'bar',
              foobar: new Foobar
            }
          ],
          obj: {
            a: [
              {
                b: {
                  c: []
                }
              }
            ],
            z: 'just a string!'
          }
        };
        this.clone = deep.clone(this.original);
        return done();
      });
      it('should generate new plain objects and arrays', function(done) {
        this.clone.obj.a[0].b.c.push(0);
        assert.notEqual(this.clone.obj.a[0].b.c.length, this.original.obj.a[0].b.c.length);
        this.clone.arr[4].bar = 'foo';
        assert(this.original.arr[4].bar == null);
        return done();
      });
      it('should preserve references to functions', function(done) {
        assert.equal(this.clone.arr[0], this.original.arr[0]);
        return done();
      });
      it('should preserve references to Buffers', function(done) {
        assert.equal(this.clone.arr[3].constructor.name, 'Buffer');
        assert.equal(this.clone.arr[3], this.original.arr[3]);
        return done();
      });
      return it('should preserve references to custom objects', function(done) {
        assert.equal(this.clone.arr[4].foobar.constructor.name, 'Foobar');
        assert.equal(this.clone.arr[4].foobar, this.original.arr[4].foobar);
        return done();
      });
    });
    describe('equals()', function() {
      it('should return true for scalar data that are identical', function() {
        var a, b;
        a = 1;
        b = 1;
        assert(deep.equals(a, b));
        a = "Hello";
        b = "Hello";
        assert(deep.equals(a, b));
        a = false;
        b = false;
        return assert(deep.equals(a, b));
      });
      it('should return false for scalar data that are different', function() {
        var a, b;
        a = 1;
        b = 2;
        assert(!deep.equals(a, b));
        a = "Hello";
        b = "Goodbye";
        assert(!deep.equals(a, b));
        a = false;
        b = true;
        return assert(!deep.equals(a, b));
      });
      it('should return true for matching references to non-plain objects', function() {
        var a, b, klass;
        klass = function(v) {
          this.v = v;
        };
        a = b = new klass("Hello");
        return assert(deep.equals(a, b));
      });
      it('should return false for non-matching references to similar non-plain objects', function() {
        var a, b, klass;
        klass = function(v) {
          this.v = v;
        };
        a = new klass("Hello");
        b = new klass("Hello");
        return assert(!deep.equals(a, b));
      });
      it('should return true for simple plain objects that are identical', function() {
        var a, b;
        a = {
          x: 1,
          y: 2
        };
        b = {
          x: 1,
          y: 2
        };
        return assert(deep.equals(a, b));
      });
      it('should return true for simple plain objects that are identical except for order', function() {
        var a, b;
        a = {
          x: 1
        };
        a.y = 2;
        b = {
          y: 2
        };
        b.x = 1;
        return assert(deep.equals(a, b));
      });
      it('should return false for simple plain objects that differ', function() {
        var a, b;
        a = {
          x: 1,
          y: 2
        };
        b = {
          x: 1,
          y: 3
        };
        return assert(!deep.equals(a, b));
      });
      it('should return true for arrays that are identical', function() {
        var a, b;
        a = [1, 2, 3, 4];
        b = [1, 2, 3, 4];
        return assert(deep.equals(a, b));
      });
      it('should return false for arrays that are identical except for order', function() {
        var a, b;
        a = [1, 2, 3, 4];
        b = [1, 2, 4, 3];
        return assert(!deep.equals(a, b));
      });
      it('should return false for arrays that differ in length', function() {
        var a, b;
        a = [1, 2, 3, 4];
        b = [1, 2, 3];
        return assert(!deep.equals(a, b));
      });
      it('should return false for arrays that differ in content', function() {
        var a, b;
        a = [1, 2, 3, 4];
        b = [5, 6, 7, 8];
        return assert(!deep.equals(a, b));
      });
      it('should return true for deeply nested content that is identical', function() {
        var a, b, klass, obj1, obj2;
        klass = function(v) {
          this.v = v;
        };
        obj1 = new klass('Hello');
        obj2 = new klass('Goodbye');
        a = [
          1, [false, null, void 0, obj1], {
            x: 3,
            y: 4,
            z: [5, 6, obj2, 'some string']
          }
        ];
        b = [
          1, [false, null, void 0, obj1], {
            x: 3,
            y: 4,
            z: [5, 6, obj2, 'some string']
          }
        ];
        return assert(deep.equals(a, b));
      });
      return it('should return false for deeply nested content that differs slightly', function() {
        var a, b, klass, obj1, obj2;
        klass = function(v) {
          this.v = v;
        };
        obj1 = new klass('Hello');
        obj2 = new klass('Goodbye');
        a = [
          1, [false, null, void 0, obj1], {
            x: 3,
            y: 4,
            z: [5, 6, obj2, 'some string']
          }
        ];
        b = [
          1, [false, null, void 0, obj1], {
            x: 3,
            y: 4,
            z: [5, 6, obj2, 'some string that is different']
          }
        ];
        return assert(!deep.equals(a, b));
      });
    });
    describe('extend()', function() {
      it('should accept multiple sources', function(done) {
        var a, b, c;
        a = {
          a: 1
        };
        b = {
          b: 2
        };
        c = {
          c: 3
        };
        deep.extend(a, b, c);
        assert.deepEqual(a, {
          a: 1,
          b: 2,
          c: 3
        });
        return done();
      });
      it('should prioritize latter arguments', function(done) {
        var a, b, c;
        a = {
          a: 1
        };
        b = {
          a: 2
        };
        c = {
          a: 3
        };
        deep.extend(a, b, c);
        assert.deepEqual(a, {
          a: 3
        });
        return done();
      });
      it('should extend recursively', function(done) {
        var a, b;
        a = {
          alpha: {
            beta: {
              charlie: 1
            }
          }
        };
        b = {
          alpha: {
            beta: {
              delta: 3
            }
          },
          epsilon: 2
        };
        deep.extend(a, b);
        assert.deepEqual(a, {
          alpha: {
            beta: {
              charlie: 1,
              delta: 3
            }
          },
          epsilon: 2
        });
        return done();
      });
      return it('should create copies of nested objects', function(done) {
        var a, b;
        a = {
          alpha: {
            beta: {
              charlie: 1
            }
          }
        };
        b = {
          alpha: {
            beta: {
              delta: [1, 2, 3, 4]
            }
          }
        };
        deep.extend(a, b);
        b.alpha.beta.delta.push(5);
        assert.equal(a.alpha.beta.delta.length, b.alpha.beta.delta.length - 1);
        return done();
      });
    });
    describe('select()', function() {
      before(function(done) {
        this.container = {
          arr: [
            function(arg) {
              return "Hello " + arg + "!";
            }, 'hello!', 1, function(arg) {
              return "Goodbye " + arg + "!";
            }, {
              foo: 'bar',
              foobar: function(arg) {
                return "Hello again " + arg + "!";
              }
            }
          ],
          obj: {
            a: [
              {
                b: {
                  c: function(arg) {
                    return "Goodbye again " + arg + "!";
                  }
                }
              }
            ],
            z: 'just a string!'
          }
        };
        this.selected = deep.select(this.container, _.isFunction);
        return done();
      });
      it("should find all objects that satisfy the filter", function(done) {
        assert.equal(this.selected.length, 4);
        assert.deepEqual(this.selected[0].value, this.container.arr[0]);
        assert.deepEqual(this.selected[1].value, this.container.arr[3]);
        assert.deepEqual(this.selected[2].value, this.container.arr[4].foobar);
        assert.deepEqual(this.selected[3].value, this.container.obj.a[0].b.c);
        return done();
      });
      return it("should report paths to objects that satisfy the filter", function(done) {
        assert.deepEqual(this.selected[0].path, ['arr', '0']);
        assert.deepEqual(this.selected[1].path, ['arr', '3']);
        assert.deepEqual(this.selected[2].path, ['arr', '4', 'foobar']);
        assert.deepEqual(this.selected[3].path, ['obj', 'a', '0', 'b', 'c']);
        return done();
      });
    });
    describe("set()", function() {
      beforeEach(function(done) {
        this.obj = {
          arr: []
        };
        return done();
      });
      it('should set values using paths', function(done) {
        deep.set(this.obj, ['arr', '0'], 'new value');
        assert.equal(this.obj.arr[0], 'new value');
        return done();
      });
      return it('should set values with path lenghts of 1', function(done) {
        deep.set(this.obj, ['new'], 'new value');
        assert.equal(this.obj["new"], 'new value');
        return done();
      });
    });
    return describe("transform()", function() {
      beforeEach(function(done) {
        this.original = {
          arr: [
            function(arg) {
              return "Hello " + arg + "!";
            }, 'hello!', 1, function(arg) {
              return "Goodbye " + arg + "!";
            }, {
              foo: 'bar',
              foobar: function(arg) {
                return "Hello again " + arg + "!";
              },
              bar: 3
            }
          ],
          obj: {
            a: [
              {
                b: {
                  c: function(arg) {
                    return "Goodbye again " + arg + "!";
                  }
                }
              }, 5
            ],
            z: 'just a string!'
          }
        };
        this.transformed = deep.transform(this.original, _.isNumber, function(v) {
          return v + 1;
        });
        return done();
      });
      it('should apply transform to values that satisfy the filter', function(done) {
        assert.equal(this.transformed.arr[2], 2);
        assert.equal(this.transformed.arr[4].bar, 4);
        assert.equal(this.transformed.obj.a[1], 6);
        return done();
      });
      return it('should not affect values that do not satisfy the filter', function(done) {
        assert.equal(this.transformed.arr[0], this.original.arr[0]);
        assert.equal(this.transformed.arr[1], this.original.arr[1]);
        assert.equal(this.transformed.obj.z, this.original.obj.z);
        return done();
      });
    });
  });

}).call(this);
