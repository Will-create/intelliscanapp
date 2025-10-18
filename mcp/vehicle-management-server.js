// Vehicle Management MCP Server
const http = require('http');
const url = require('url');

// Simple HTTP server to simulate MCP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`Vehicle Management MCP Server request: ${req.method} ${path}`);
  
  // Handle different vehicle management operations
  let response = {};
  
  try {
    switch (path) {
      case '/vehicle/details':
        response = {
          id: '1',
          make: 'Toyota',
          model: 'Camry',
          year: 2019,
          mileage: 45280,
          vin: '1HGCM82633A123456',
          next_service: '2024-03-15',
          upcoming_maintenance: [
            {
              type: 'Oil Change',
              date: '2024-03-15',
              status: 'scheduled'
            },
            {
              type: 'Tire Rotation',
              date: '2024-04-01',
              status: 'scheduled'
            }
          ]
        };
        break;
        
      case '/vehicle/plans':
        response = {
          plans: [
            {
              id: '1',
              name: 'Regular Maintenance',
              service_type: 'Oil Change',
              frequency: '3 months',
              active: true
            },
            {
              id: '2',
              name: 'Tire Maintenance',
              service_type: 'Tire Rotation',
              frequency: '6 months',
              active: true
            }
          ]
        };
        break;
        
      case '/vehicle/repairs':
        response = {
          repairs: [
            {
              id: '1',
              type: 'Brake Pad Replacement',
              date: '2023-12-15',
              cost: 299.99,
              status: 'completed'
            },
            {
              id: '2',
              type: 'Oil Change',
              date: '2023-09-15',
              cost: 89.99,
              status: 'completed'
            }
          ]
        };
        break;
        
      default:
        response = {
          error: 'Unknown endpoint'
        };
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  } catch (error) {
    console.error('Error processing request:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Vehicle Management MCP Server listening on port ${PORT}`);
});