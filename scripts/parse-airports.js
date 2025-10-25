const fs = require('fs');
const path = require('path');

// Read the master airport list
const masterList = fs.readFileSync(path.join(__dirname, '../docs/master-airport-list.md'), 'utf-8');

const airports = [];
const lines = masterList.split('\n');

let currentRegion = '';
let currentState = '';

for (const line of lines) {
  // Check for region headers (### Region)
  if (line.startsWith('### ')) {
    currentRegion = line.replace('### ', '').trim();
    continue;
  }
  
  // Check for state headers (#### State)
  if (line.startsWith('#### ')) {
    currentState = line.replace('#### ', '').trim();
    continue;
  }
  
  // Parse airport lines (- CODE - Name, City, State/Province)
  if (line.startsWith('- ') && line.includes(' - ')) {
    const match = line.match(/^- ([A-Z]{3}) - (.+), (.+), (.+)$/);
    if (match) {
      const [, code, name, city, location] = match;
      airports.push({
        code,
        name,
        city,
        location,
        state: currentState,
        region: currentRegion
      });
    }
  }
}

// Write to JSON file
fs.writeFileSync(
  path.join(__dirname, '../frontend/airports.json'),
  JSON.stringify(airports, null, 2)
);

console.log(`Parsed ${airports.length} airports`);
