// Global variables
let airportsData = [];
let map = null;
let markers = [];

// Approximate coordinates for major US cities/regions (for demo purposes)
const CITY_COORDS = {
  'New York City': [40.7128, -74.0060],
  'Boston': [42.3601, -71.0589],
  'Philadelphia': [39.9526, -75.1652],
  'Washington': [38.9072, -77.0369],
  'Charlotte': [35.2271, -80.8431],
  'Atlanta': [33.7490, -84.3880],
  'Miami': [25.7617, -80.1918],
  'Orlando': [28.5383, -81.3792],
  'Tampa': [27.9506, -82.4572],
  'Jacksonville': [30.3322, -81.6557],
  'New Orleans': [29.9511, -90.0715],
  'Houston': [29.7604, -95.3698],
  'Dallas': [32.7767, -96.7970],
  'San Antonio': [29.4241, -98.4936],
  'Austin': [30.2672, -97.7431],
  'Phoenix': [33.4484, -112.0740],
  'Las Vegas': [36.1699, -115.1398],
  'Los Angeles': [34.0522, -118.2437],
  'San Diego': [32.7157, -117.1611],
  'San Francisco': [37.7749, -122.4194],
  'San Jose': [37.3382, -121.8863],
  'Oakland': [37.8044, -122.2712],
  'Sacramento': [38.5816, -121.4944],
  'Portland': [45.5152, -122.6784],
  'Seattle': [47.6062, -122.3321],
  'Anchorage': [61.2181, -149.9003],
  'Honolulu': [21.3099, -157.8581],
  'Chicago': [41.8781, -87.6298],
  'Detroit': [42.3314, -83.0458],
  'Minneapolis': [44.9778, -93.2650],
  'St. Louis': [38.6270, -90.1994],
  'Kansas City': [39.0997, -94.5786],
  'Denver': [39.7392, -104.9903],
  'Salt Lake City': [40.7608, -111.8910],
  'Indianapolis': [39.7684, -86.1581],
  'Cleveland': [41.4993, -81.6944],
  'Pittsburgh': [40.4406, -79.9959],
  'Nashville': [36.1627, -86.7816],
  'Memphis': [35.1495, -90.0490],
  'Milwaukee': [43.0389, -87.9065],
  'Cincinnati': [39.1031, -84.5120],
  'Columbus': [39.9612, -82.9988],
  'Raleigh': [35.7796, -78.6382],
  'Buffalo': [42.8864, -78.8784],
  'Toronto': [43.6532, -79.3832],
  'Montreal': [45.5017, -73.5673],
  'Vancouver': [49.2827, -123.1207],
  'Calgary': [51.0447, -114.0719],
  'Edmonton': [53.5461, -113.4938],
  'Ottawa': [45.4215, -75.6972],
  'Winnipeg': [49.8951, -97.1384],
  'Halifax': [44.6488, -63.5752],
  'Mexico City': [19.4326, -99.1332],
  'Cancún': [21.1619, -86.8515],
  'Guadalajara': [20.6597, -103.3496],
  'Monterrey': [25.6866, -100.3161],
  'San Juan': [18.4655, -66.1057],
  'Nassau': [25.0443, -77.3504]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await loadAirportData();
  initializeMap();
  updateStats();
  
  // Add enter key support for search
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Display all airports initially
  displaySearchResults(airportsData);
});

// Load airport data from JSON
async function loadAirportData() {
  try {
    const response = await fetch('airports.json');
    airportsData = await response.json();
    console.log(`Loaded ${airportsData.length} airports`);
  } catch (error) {
    console.error('Error loading airport data:', error);
    airportsData = [];
  }
}

// Initialize the map
function initializeMap() {
  // Center on North America
  map = L.map('mapContainer').setView([39.8283, -98.5795], 4);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);
  
  // Add markers for all airports
  addAirportMarkers(airportsData);
}

// Add markers to the map
function addAirportMarkers(airports) {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  airports.forEach(airport => {
    const coords = getApproximateCoords(airport);
    if (coords) {
      const marker = L.marker(coords)
        .bindPopup(`
          <div class="airport-popup">
            <h3>${airport.code}</h3>
            <p><strong>${airport.name}</strong></p>
            <p>${airport.city}, ${airport.location}</p>
            <p><em>Region: ${airport.region}</em></p>
          </div>
        `)
        .addTo(map);
      markers.push(marker);
    }
  });
}

// Get approximate coordinates for an airport
function getApproximateCoords(airport) {
  // Try to match by city name
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (airport.city.includes(city) || city.includes(airport.city)) {
      // Add small random offset to separate airports in the same city
      const offset = 0.1;
      return [
        coords[0] + (Math.random() - 0.5) * offset,
        coords[1] + (Math.random() - 0.5) * offset
      ];
    }
  }
  return null;
}

// Perform search
function performSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  
  if (!searchTerm) {
    displaySearchResults(airportsData);
    addAirportMarkers(airportsData);
    return;
  }
  
  const results = airportsData.filter(airport => {
    return airport.code.toLowerCase().includes(searchTerm) ||
           airport.name.toLowerCase().includes(searchTerm) ||
           airport.city.toLowerCase().includes(searchTerm) ||
           airport.location.toLowerCase().includes(searchTerm) ||
           airport.state.toLowerCase().includes(searchTerm) ||
           airport.region.toLowerCase().includes(searchTerm);
  });
  
  displaySearchResults(results);
  addAirportMarkers(results);
  
  // Update map view if there are results
  if (results.length > 0) {
    const coords = getApproximateCoords(results[0]);
    if (coords) {
      map.setView(coords, 8);
    }
  }
}

// Clear search
function clearSearch() {
  document.getElementById('searchInput').value = '';
  displaySearchResults(airportsData);
  addAirportMarkers(airportsData);
  map.setView([39.8283, -98.5795], 4);
}

// Display search results
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('searchResults');
  const statsContainer = document.getElementById('searchStats');
  
  if (results.length === 0) {
    statsContainer.innerHTML = '<p>No airports found matching your search.</p>';
    resultsContainer.innerHTML = '';
    return;
  }
  
  statsContainer.innerHTML = `<p>Found ${results.length} airport${results.length !== 1 ? 's' : ''}</p>`;
  
  // Group by region
  const byRegion = {};
  results.forEach(airport => {
    if (!byRegion[airport.region]) {
      byRegion[airport.region] = [];
    }
    byRegion[airport.region].push(airport);
  });
  
  let html = '';
  for (const [region, airports] of Object.entries(byRegion)) {
    html += `<div class="region-group">`;
    html += `<h3>${region}</h3>`;
    html += `<div class="airport-grid">`;
    
    airports.forEach(airport => {
      html += `
        <div class="airport-card" onclick="highlightAirport('${airport.code}')">
          <div class="airport-code">${airport.code}</div>
          <div class="airport-name">${airport.name}</div>
          <div class="airport-location">${airport.city}, ${airport.location}</div>
        </div>
      `;
    });
    
    html += `</div></div>`;
  }
  
  resultsContainer.innerHTML = html;
}

// Highlight an airport on the map
function highlightAirport(code) {
  const airport = airportsData.find(a => a.code === code);
  if (airport) {
    const coords = getApproximateCoords(airport);
    if (coords) {
      map.setView(coords, 10);
      // Find and open the corresponding marker popup
      markers.forEach(marker => {
        if (marker.getLatLng().lat === coords[0] && marker.getLatLng().lng === coords[1]) {
          marker.openPopup();
        }
      });
    }
  }
}

// Update statistics
function updateStats() {
  document.getElementById('totalAirports').textContent = airportsData.length;
  
  const regions = new Set(airportsData.map(a => a.region));
  document.getElementById('totalRegions').textContent = regions.size;
  
  const states = new Set(airportsData.map(a => a.state));
  document.getElementById('totalStates').textContent = states.size;
}
