import parseLxlTag from 'ember-letter-by-letter/utils/parse-lxl-tag';
import { module, test } from 'qunit';

module('Unit | Utility | parse lxl tag');

test('it grabs the tagName', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[foo]]');

  assert.equal(result.tagName, 'foo', 'tagName is correct');
});

test('`method` is "start" if `#`', function(assert) {
  assert.expect(3);

  const result = parseLxlTag('[[#foo]]');

  assert.equal(result.method, 'open', 'method is correct');
  assert.ok(result.isOpening, '`isOpening` is true');
  assert.ok(!result.isClosing, '`isClosing` is false');
});

test('`method` is "start" if none', function(assert) {
  assert.expect(3);

  const result = parseLxlTag('[[foo]]');

  assert.equal(result.method, 'execute', 'method is correct');
  assert.ok(!result.isOpening, '`isOpening` is false');
  assert.ok(!result.isClosing, '`isClosing` is false');
});

test('`method` is "stop" if `/`', function(assert) {
  assert.expect(3);

  const result = parseLxlTag('[[/foo]]');

  assert.equal(result.method, 'close', 'method is correct');
  assert.ok(!result.isOpening, '`isOpening` is false');
  assert.ok(result.isClosing, '`isClosing` is true');
});

test('`params` are split by spaces', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo bar baz]]');

  assert.deepEqual(result.params, ['bar', 'baz'], 'params are correct');
});

test('`params` are split by spaces, unless in double quotes', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo "I went to the bar, and \'ordered\' a drink" baz \'single quotes "also" work\' me=meep "as do a coder\'s unmatched quotes"]]');

  assert.deepEqual(result.params, [
    "I went to the bar, and 'ordered' a drink",
    'baz',
    'single quotes "also" work',
    "as do a coder's unmatched quotes"
  ], 'params are correct');
});

test('`hash` is an object extracted from the params by =', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo simple=example aParam "string key"=string_key string_value="string value" anotherParam anotheranotherParam "strings everywhere"="key and value" "just a = param with an equal"]]');

  assert.deepEqual(result.hash, {
    simple: 'example',
    'string key': 'string_key',
    string_value: 'string value',
    'strings everywhere': 'key and value'
  }, 'hash is correct');
});
