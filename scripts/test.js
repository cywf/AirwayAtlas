#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Running tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test airport data parsing
test('airports.json exists', () => {
  const filePath = path.join(__dirname, '../frontend/airports.json');
  assert(fs.existsSync(filePath), 'airports.json file should exist');
});

test('airports.json is valid JSON', () => {
  const filePath = path.join(__dirname, '../frontend/airports.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  assert(Array.isArray(data), 'airports.json should contain an array');
});

test('airports have required fields', () => {
  const filePath = path.join(__dirname, '../frontend/airports.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  assert(data.length > 0, 'should have at least one airport');
  
  const airport = data[0];
  assert(airport.code, 'airport should have code');
  assert(airport.name, 'airport should have name');
  assert(airport.city, 'airport should have city');
  assert(airport.location, 'airport should have location');
  assert(airport.state, 'airport should have state');
  assert(airport.region, 'airport should have region');
});

test('airport codes are 3 characters', () => {
  const filePath = path.join(__dirname, '../frontend/airports.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  data.forEach(airport => {
    assert(airport.code.length === 3, `${airport.code} should be 3 characters`);
    assert(/^[A-Z]{3}$/.test(airport.code), `${airport.code} should be uppercase letters`);
  });
});

// Test frontend files exist
test('index.html exists', () => {
  const filePath = path.join(__dirname, '../frontend/index.html');
  assert(fs.existsSync(filePath), 'index.html should exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.length > 0, 'index.html should not be empty');
});

test('scripts.js exists', () => {
  const filePath = path.join(__dirname, '../frontend/scripts.js');
  assert(fs.existsSync(filePath), 'scripts.js should exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.length > 0, 'scripts.js should not be empty');
});

test('styles.css exists', () => {
  const filePath = path.join(__dirname, '../frontend/styles.css');
  assert(fs.existsSync(filePath), 'styles.css should exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.length > 0, 'styles.css should not be empty');
});

// Summary
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
