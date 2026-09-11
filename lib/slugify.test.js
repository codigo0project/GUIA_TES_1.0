const assert = require('assert');
const { slugify } = require('./slugify');

// Test helper
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('✓ ' + name);
    passed++;
  } catch (e) {
    console.log('✗ ' + name);
    console.log('  Error: ' + e.message);
    failed++;
  }
}

test('converts lowercase', () => {
  assert.strictEqual(slugify('HELLO WORLD'), 'hello-world');
});

test('converts accented characters to ASCII', () => {
  assert.strictEqual(slugify('Época'), 'epoca');
  assert.strictEqual(slugify('Óptica'), 'optica');
});

test('replaces spaces and punctuation with hyphens', () => {
  assert.strictEqual(slugify('Control de Hemorragias'), 'control-de-hemorragias');
  assert.strictEqual(slugify('RCP Pediátrica y del Lactante'), 'rcp-pediatrica-y-del-lactante');
});

test('removes diacritical marks', () => {
  assert.strictEqual(slugify('¿Qué tal?'), 'que-tal');
});

test('trims leading and trailing hyphens', () => {
  assert.strictEqual(slugify('  Mi Título  '), 'mi-titulo');
  assert.strictEqual(slugify('!!!Test!!!'), 'test');
});

test('handles empty string', () => {
  assert.strictEqual(slugify(''), '');
});

test('replaces multiple spaces with single hyphen', () => {
  assert.strictEqual(slugify('RCP  de   alta   calidad'), 'rcp-de-alta-calidad');
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);