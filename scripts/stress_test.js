const http = require('http');

const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
  '/',
  '/login',
  '/emr',
  '/laboratorium',
  '/radiologi',
  '/kasir-billing',
  '/kamar-operasi',
  '/farmasi',
  '/satusehat',
  '/bpjs'
];

const CONCURRENCY = 20; // 20 concurrent connections
const TOTAL_REQUESTS = 200; // 200 total requests

console.log('====================================================');
console.log('⚡ SIMRS ENTERPRISE HIGH-SPEED STRESS TEST BENCHMARK');
console.log(`Target: ${BASE_URL}`);
console.log(`Concurrency: ${CONCURRENCY} concurrent workers`);
console.log(`Total Requests: ${TOTAL_REQUESTS} requests`);
console.log('====================================================\n');

let completed = 0;
let successCount = 0;
let failCount = 0;
const latencies = [];
const statusMap = {};

const startTime = Date.now();

function makeRequest(index) {
  const endpoint = ENDPOINTS[index % ENDPOINTS.length];
  const reqStart = Date.now();

  const req = http.get(`${BASE_URL}${endpoint}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      const duration = Date.now() - reqStart;
      latencies.push(duration);
      statusMap[res.statusCode] = (statusMap[res.statusCode] || 0) + 1;

      if (res.statusCode >= 200 && res.statusCode < 400) {
        successCount++;
      } else {
        failCount++;
      }

      completed++;
      if (completed < TOTAL_REQUESTS) {
        makeRequest(completed);
      } else if (completed === TOTAL_REQUESTS) {
        printReport();
      }
    });
  });

  req.on('error', (err) => {
    failCount++;
    completed++;
    statusMap['ERROR'] = (statusMap['ERROR'] || 0) + 1;
    if (completed < TOTAL_REQUESTS) {
      makeRequest(completed);
    } else if (completed === TOTAL_REQUESTS) {
      printReport();
    }
  });

  req.end();
}

function printReport() {
  const totalTimeMs = Date.now() - startTime;
  const totalTimeSec = totalTimeMs / 1000;
  const rps = (completed / totalTimeSec).toFixed(2);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);

  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || maxLatency;

  console.log('----------------------------------------------------');
  console.log('📊 SIMRS STRESS TEST BENCHMARK RESULTS');
  console.log('----------------------------------------------------');
  console.log(`⏱️ Total Time Elapsed: ${totalTimeSec.toFixed(2)} seconds (${totalTimeMs} ms)`);
  console.log(`🚀 Throughput Rate:    ${rps} requests/sec`);
  console.log(`✅ Success Rate:       ${((successCount / completed) * 100).toFixed(1)}% (${successCount}/${completed})`);
  console.log(`⚡ Average Latency:    ${avgLatency} ms`);
  console.log(`⚡ Min Latency:        ${minLatency} ms`);
  console.log(`⚡ Max Latency:        ${maxLatency} ms`);
  console.log(`⚡ 95th Percentile:    ${p95} ms`);
  console.log('----------------------------------------------------');
  console.log('Status Breakdown:', JSON.stringify(statusMap));
  console.log('====================================================\n');
}

// Start concurrent request workers
for (let i = 0; i < CONCURRENCY; i++) {
  makeRequest(i);
}
