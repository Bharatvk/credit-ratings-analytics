const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = Number(process.env.MOCK_API_PORT || 3001);
const BASE_DIR = path.resolve(__dirname, '..');
const ISSUERS_PATH = path.join(BASE_DIR, 'public', 'mock-api', 'issuers.json');
const DETAILS_DIR = path.join(BASE_DIR, 'public', 'mock-api', 'details');

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

function sendApiError(response, status, code, message) {
  sendJson(response, status, {
    success: false,
    error: {
      code,
      message,
    },
  });
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * 600) + 300;
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  if (!chunks.length) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateFeedback(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Request body is required.';
  }

  if (!payload.issuerId) {
    return 'issuerId is required.';
  }

  const user = payload.user || {};
  if (!user.name || String(user.name).trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }
  if (!user.email || !isValidEmail(String(user.email))) {
    return 'Invalid email format';
  }
  if (!user.role) {
    return 'Role is required.';
  }

  const ratings = payload.ratings || {};
  const fields = ['accuracy', 'driverRelevance', 'aiInsightQuality', 'timeliness'];
  for (const field of fields) {
    const value = Number(ratings[field]);
    if (!value || value < 1 || value > 5) {
      return `${field} must be between 1 and 5.`;
    }
  }

  return null;
}

function shouldForceError(url) {
  return url.searchParams.get('mockError') === '1';
}

async function handler(request, response) {
  const url = new URL(request.url || '/', 'http://127.0.0.1');
  await sleep(randomDelay());

  if (shouldForceError(url)) {
    return sendApiError(response, 500, 'INTERNAL_ERROR', 'Forced mock server error.');
  }

  if (request.method === 'GET' && url.pathname === '/api/issuers') {
    try {
      const issuers = await readJson(ISSUERS_PATH);
      return sendJson(response, 200, issuers);
    } catch (error) {
      return sendApiError(response, 500, 'DATA_READ_ERROR', 'Unable to read issuers data.');
    }
  }

  if (request.method === 'GET' && url.pathname.startsWith('/api/issuers/')) {
    const issuerId = url.pathname.split('/').pop();
    const filePath = path.join(DETAILS_DIR, `${issuerId}.json`);
    try {
      const details = await readJson(filePath);
      return sendJson(response, 200, details);
    } catch (error) {
      return sendApiError(response, 404, 'NOT_FOUND', 'Requested issuer was not found.');
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/feedback') {
    try {
      const payload = await readRequestBody(request);
      const validationMessage = validateFeedback(payload);
      if (validationMessage) {
        return sendApiError(response, 400, 'VALIDATION_ERROR', validationMessage);
      }

      return sendJson(response, 200, {
        success: true,
        feedbackId: `fb_${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, '0')}`,
        message: 'Thank you for your feedback!',
      });
    } catch (error) {
      return sendApiError(response, 500, 'SERVER_ERROR', 'Failed to process feedback payload.');
    }
  }

  return sendApiError(response, 404, 'NOT_FOUND', 'Endpoint not found.');
}

const server = http.createServer(handler);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-api] listening on http://127.0.0.1:${PORT}`);
});
