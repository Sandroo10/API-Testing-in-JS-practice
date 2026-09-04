const pino = require('pino');

const sensitiveKey = /^(authorization|cookie|set-cookie|password|token)$/i;
const maxResponseBodyLines = 30;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});

function redactSensitiveData(value) {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveData);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKey.test(key) ? '[REDACTED]' : redactSensitiveData(item)
      ])
    );
  }

  return value;
}

function parseJson(value) {
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function plainHeaders(headers) {
  if (!headers) return {};
  return typeof headers.toJSON === 'function' ? headers.toJSON() : headers;
}

function responseBodyPreview(body) {
  const formattedBody = formatJson(body);
  const lines = formattedBody.split('\n');

  if (lines.length <= maxResponseBodyLines) return formattedBody;

  const omittedLineCount = lines.length - maxResponseBodyLines;
  return `${lines.slice(0, maxResponseBodyLines).join('\n')}\n... [${omittedLineCount} response lines omitted]`;
}

function formatJson(value) {
  const safeValue = redactSensitiveData(value);

  if (safeValue === undefined || safeValue === null) return '—';

  try {
    return JSON.stringify(safeValue, null, 2);
  } catch {
    return String(safeValue);
  }
}

function formatScenarioLog(scenarioName, response) {
  const { config } = response;
  const endpoint = new URL(config.url, config.baseURL).toString();

  return [
    `Scenario: ${scenarioName}`,
    `URL: ${endpoint}`,
    `Request Method: ${config.method.toUpperCase()}`,
    'Request JSON:',
    formatJson(parseJson(config.data)),
    'Request Headers:',
    formatJson(plainHeaders(config.headers)),
    `Response Status: ${response.status}`,
    'Response Headers:',
    formatJson(plainHeaders(response.headers)),
    'Response Body:',
    responseBodyPreview(response.data)
  ].join('\n\n');
}

function logScenarioHttpResult(scenarioName, response) {
  if (!response) {
    logger.warn({ scenario: scenarioName }, 'Scenario finished without an HTTP response');
    return;
  }

  logger.info(`\n${formatScenarioLog(scenarioName, response)}`);
}

module.exports = { logScenarioHttpResult };
