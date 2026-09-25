import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const API_KEY = process.env.TOKKO_API_KEY;
if (!API_KEY) {
  console.error('TOKKO_API_KEY environment variable is required');
  process.exit(1);
}
const BRANCH_ID = 85101;
const COMPANY_ID = 47477;
const BASE_URL = 'https://www.tokkobroker.com/api/v1';
const AUDIT_DIR = join(process.cwd(), 'audit', 'raw');

if (!existsSync(AUDIT_DIR)) {
  mkdirSync(AUDIT_DIR, { recursive: true });
}

const API_KEY_RE = API_KEY ? new RegExp(API_KEY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : null;

function sanitize(obj) {
  if (typeof obj === 'string') {
    return API_KEY_RE ? obj.replace(API_KEY_RE, '[REDACTED]') : obj;
  }
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(obj)) {
      clean[k] = sanitize(v);
    }
    return clean;
  }
  return obj;
}

async function fetchJSON(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.status === 429) {
        const wait = Math.pow(2, i + 1) * 1000;
        console.log(`  Rate limited. Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      const wait = Math.pow(2, i + 1) * 1000;
      console.log(`  Retry ${i + 1}/${retries}: ${err.message}. Waiting ${wait}ms...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

function safeStr(val, maxLen = 50) {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'object') return JSON.stringify(val).substring(0, maxLen);
  return String(val).substring(0, maxLen).replace(/\|/g, '-').replace(/\n/g, ' ');
}

function extractFichaHash(publicUrl) {
  if (!publicUrl) return 'N/A';
  const match = publicUrl.match(/\/p\/([a-f0-9]+)/);
  return match ? match[1] : 'N/A';
}

async function main() {
  console.log('=== TOKKO API VALIDATION — PHASE 1 ===\n');

  // Step 1: Download ALL properties
  console.log('--- Step 1: Download all properties ---');
  const LIMIT = 50;
  let offset = 0;
  let allProperties = [];
  let page = 1;
  
  while (true) {
    const url = `${BASE_URL}/property/?key=${API_KEY}&format=json&limit=${LIMIT}&offset=${offset}&lang=es`;
    console.log(`  Page ${page} (offset=${offset})...`);
    const res = await fetchJSON(url);
    allProperties = allProperties.concat(res.objects);
    
    writeFileSync(
      join(AUDIT_DIR, `properties-page-${page}.json`),
      JSON.stringify(sanitize(res), null, 2)
    );
    
    console.log(`    Got ${res.objects.length} (${allProperties.length}/${res.meta.total_count})`);
    if (!res.meta.next || res.objects.length === 0) break;
    offset += LIMIT;
    page++;
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log(`Total downloaded: ${allProperties.length}\n`);

  // Step 2: Branch analysis
  console.log('--- Step 2: Branch analysis ---');
  const branchStats = {};
  for (const p of allProperties) {
    const bid = p.branch?.id || 'N/A';
    const bname = p.branch?.name || p.branch?.display_name || 'N/A';
    const key = `${bid} | ${bname}`;
    if (!branchStats[key]) branchStats[key] = { count: 0, id: bid, name: bname };
    branchStats[key].count++;
  }
  for (const [key, stat] of Object.entries(branchStats).sort((a, b) => b[1].count - a[1].count)) {
    console.log(`  ${key}: ${stat.count}`);
  }
  console.log('');

  // Step 3: Branch 85101
  const branch85101 = allProperties.filter(p => p.branch?.id === BRANCH_ID);
  console.log(`Branch 85101: ${branch85101.length} properties\n`);

  // Step 4: Field mapping
  console.log('--- Step 3: Field mapping ---');
  const fieldTypes = {};
  for (const p of branch85101) {
    for (const [key, val] of Object.entries(p)) {
      if (!fieldTypes[key]) {
        fieldTypes[key] = { count: 0, type: Array.isArray(val) ? 'array' : typeof val, samples: [] };
      }
      fieldTypes[key].count++;
      if (fieldTypes[key].samples.length < 3 && val !== null && val !== '' && val !== 0) {
        fieldTypes[key].samples.push(typeof val === 'object' ? JSON.stringify(val).substring(0, 80) : String(val).substring(0, 80));
      }
    }
  }

  let fieldMap = '# Tokko Field Mapping — Branch 85101\n\n';
  fieldMap += `Properties analyzed: ${branch85101.length}\n\n`;
  fieldMap += '| Field | Type | Count | Sample |\n';
  fieldMap += '|-------|------|-------|--------|\n';
  
  const sortedFields = Object.entries(fieldTypes).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [key, info] of sortedFields) {
    const sample = info.samples[0] || 'N/A';
    fieldMap += `| ${key} | ${info.type} | ${info.count}/${branch85101.length} | ${sample.replace(/\|/g, '/')} |\n`;
  }
  writeFileSync(join(process.cwd(), 'audit', 'tokko-field-mapping.md'), fieldMap);
  console.log(`Mapped ${sortedFields.length} fields\n`);

  // Step 5: Validation table
  console.log('--- Step 4: Validation table ---');
  let table = '# Property Validation Table — Branch 85101 (Ezequiel)\n\n';
  table += `- **Total in API**: ${allProperties.length}\n`;
  table += `- **Branch 85101**: ${branch85101.length}\n`;
  table += `- **Company ID**: ${COMPANY_ID}\n\n`;
  table += '| # | Tokko ID | Branch | Title | Type | Operation | Price | Bedrooms | Bathrooms | Surface | Images | Videos | Agent | Public URL | Ficha Hash |\n';
  table += '|---|----------|--------|-------|------|-----------|-------|----------|-----------|---------|--------|--------|-------|------------|------------|\n';
  
  for (let i = 0; i < branch85101.length; i++) {
    const p = branch85101[i];
    const ops = p.operations || {};
    let opStr = '-', priceStr = '-';
    for (const op of ops) {
      if (op.type === 'Sale') { opStr = 'Venta'; priceStr = op.prices?.[0] ? `${op.prices[0].currency} ${op.prices[0].amount}` : '-'; }
      else if (op.type === 'Rent') { opStr = 'Alquiler'; priceStr = op.prices?.[0] ? `${op.prices[0].currency} ${op.prices[0].amount}` : '-'; }
      else if (op.type === 'TemporaryRent') { opStr = 'Temporario'; priceStr = op.prices?.[0] ? `${op.prices[0].currency} ${op.prices[0].amount}` : '-'; }
    }
    
    // Fallback for old operations format
    if (opStr === '-') {
      if (ops.Sale) { opStr = 'Venta'; priceStr = String(ops.Sale[0] || '-'); }
      else if (ops.Rent) { opStr = 'Alquiler'; priceStr = String(ops.Rent[0] || '-'); }
    }
    
    const images = p.photos?.length || 0;
    const vidNorm = p.videos?.length || 0;
    const agent = p.producer?.name || 'N/A';
    const title = safeStr(p.publication_title, 45);
    const ptype = safeStr(p.type?.name, 15);
    const bedrooms = p.total_suites ?? p.suite_amount ?? '-';
    const bathrooms = p.bathroom_amount ?? '-';
    const surface = p.surface || p.roofed_surface || '-';
    const pubUrl = p.public_url || 'N/A';
    const fichaHash = extractFichaHash(pubUrl);
    
    table += `| ${i+1} | ${p.id} | ${p.branch?.id} | ${title} | ${ptype} | ${opStr} | ${safeStr(priceStr, 20)} | ${bedrooms} | ${bathrooms} | ${surface} | ${images} | ${vidNorm} | ${safeStr(agent, 20)} | ${safeStr(pubUrl, 40)} | ${fichaHash.substring(0, 16)} |\n`;
  }
  writeFileSync(join(process.cwd(), 'audit', 'property-validation-table.md'), table);
  console.log(`Table created: ${branch85101.length} properties\n`);

  // Step 6: Ficha mapping
  console.log('--- Step 5: Ficha mapping ---');
  let fichaMap = '# Ficha.info Mapping — Branch 85101\n\n';
  fichaMap += '## Field Discovery\n\n';
  fichaMap += '- **`public_url`**: Campo que contiene la URL completa de ficha.info\n';
  fichaMap += '- **Formato**: `https://ficha.info/p/{hash}` (sin parámetro `?v=` en la API)\n';
  fichaMap += '- **`hash`**: NO existe como campo directo en la respuesta de la API\n';
  fichaMap += '- **Extracción**: El hash se extrae del campo `public_url`\n\n';
  fichaMap += '| # | Tokko ID | Title | Public URL | Hash Extracted |\n';
  fichaMap += '|---|----------|-------|------------|----------------|\n';
  
  let hashCount = 0;
  let noHashCount = 0;
  for (let i = 0; i < branch85101.length; i++) {
    const p = branch85101[i];
    const pubUrl = p.public_url || 'N/A';
    const hash = extractFichaHash(pubUrl);
    if (hash !== 'N/A') hashCount++;
    else noHashCount++;
    fichaMap += `| ${i+1} | ${p.id} | ${safeStr(p.publication_title, 40)} | ${safeStr(pubUrl, 50)} | ${hash.substring(0, 20)} |\n`;
  }
  
  fichaMap += `\n## Summary\n\n`;
  fichaMap += `- Properties with public_url: ${branch85101.length - noHashCount}/${branch85101.length}\n`;
  fichaMap += `- Properties without public_url: ${noHashCount}/${branch85101.length}\n`;
  fichaMap += `- Hash extraction success: ${hashCount}/${branch85101.length}\n`;
  
  writeFileSync(join(process.cwd(), 'audit', 'ficha-mapping.md'), fichaMap);
  console.log(`Ficha mapping: ${hashCount} hashes found, ${noHashCount} missing\n`);

  // Step 7: Media analysis
  console.log('--- Step 6: Media analysis ---');
  let totalImages = 0, totalVideos = 0, withImages = 0, withVideos = 0;
  let imageSample = null;
  
  for (const p of branch85101) {
    const imgCount = p.photos?.length || 0;
    const vidCount = p.videos?.length || 0;
    totalImages += imgCount;
    totalVideos += vidCount;
    if (imgCount > 0) withImages++;
    if (vidCount > 0) withVideos++;
    if (!imageSample && imgCount > 0) imageSample = p.photos?.[0];
  }
  
  console.log(`  With images: ${withImages}/${branch85101.length}`);
  console.log(`  Total images: ${totalImages}`);
  console.log(`  With videos: ${withVideos}/${branch85101.length}`);
  console.log(`  Total videos: ${totalVideos}`);
  if (imageSample) console.log(`  Sample image URL: ${typeof imageSample === 'string' ? imageSample.substring(0, 80) : JSON.stringify(imageSample).substring(0, 80)}`);
  console.log('');

  // Step 8: Agents
  console.log('--- Step 7: Agents ---');
  const agents = {};
  for (const p of branch85101) {
    const a = p.producer?.name || 'N/A';
    agents[a] = (agents[a] || 0) + 1;
  }
  for (const [name, count] of Object.entries(agents).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name}: ${count}`);
  }
  console.log('');

  // Step 9: Operations
  console.log('--- Step 8: Operations ---');
  const opStats = {};
  for (const p of branch85101) {
    const ops = p.operations || [];
    for (const op of ops) {
      const t = op.type || 'Unknown';
      opStats[t] = (opStats[t] || 0) + 1;
    }
  }
  for (const [op, count] of Object.entries(opStats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${op}: ${count}`);
  }
  console.log('');

  // Step 10: Types
  console.log('--- Step 9: Property types ---');
  const types = {};
  for (const p of branch85101) {
    const t = p.type?.name || 'N/A';
    types[t] = (types[t] || 0) + 1;
  }
  for (const [type, count] of Object.entries(types).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('');

  // Step 11: Sample full property
  console.log('--- Step 10: Full sample property ---');
  if (branch85101.length > 0) {
    const sample = branch85101[0];
    writeFileSync(
      join(AUDIT_DIR, 'sample-property-full.json'),
      JSON.stringify(sanitize(sample), null, 2)
    );
    console.log(`  Saved full sample for Tokko ID: ${sample.id}`);
  }
  console.log('');

  console.log('=== FASE 1 COMPLETE ===');
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
