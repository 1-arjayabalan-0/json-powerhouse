/**
 * Writes the generator settings (src/core/config/generator-settings.ts) into
 * contributes.configuration of package.json, so the VS Code Settings editor always matches
 * the options the shared generators support.
 *
 *   node scripts/sync-settings.cjs          update package.json
 *   node scripts/sync-settings.cjs --check  exit 1 if package.json is out of date
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const pkgPath = path.join(root, 'package.json');

const bundled = esbuild.buildSync({
    entryPoints: [path.join(root, '..', 'src', 'core', 'config', 'generator-settings.ts')],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    tsconfig: path.join(root, 'tsconfig.json'),
    logLevel: 'silent',
});
const mod = { exports: {} };
new Function('module', 'exports', 'require', bundled.outputFiles[0].text)(mod, mod.exports, require);
const { toVsCodeConfiguration } = mod.exports;

const PREFIX = 'json-powerhouse';
const generated = toVsCodeConfiguration(PREFIX, 10);
const managedKeys = new Set(generated.flatMap(s => Object.keys(s.properties)));

const raw = fs.readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(raw);
const current = pkg.contributes.configuration;
const sections = Array.isArray(current) ? current : [current];

// Keep the hand-written general section (formatting, diff, validation); drop anything generated.
const general = sections.find(s => s.id === PREFIX || (!s.id && s.title === 'JSON PowerHouse')) || { properties: {} };
const generalProps = Object.fromEntries(Object.entries(general.properties).filter(([k]) => !managedKeys.has(k)));

pkg.contributes.configuration = [
    { id: PREFIX, title: 'JSON PowerHouse', order: 0, properties: generalProps },
    ...generated,
];

const next = JSON.stringify(pkg, null, 4) + '\n';
if (process.argv.includes('--check')) {
    if (next !== raw) {
        console.error('package.json settings are out of date. Run: npm run sync-settings');
        process.exit(1);
    }
    console.log('package.json settings are up to date.');
} else {
    fs.writeFileSync(pkgPath, next);
    console.log(`Synced ${managedKeys.size} generator settings in ${generated.length} sections.`);
}
