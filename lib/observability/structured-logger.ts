import { randomUUID } from 'node:crypto';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  readonly correlationId: string;
  readonly tenantId?: string;
  readonly actorId?: string;
  readonly source?: string;
}

export interface StructuredLogEntry {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly event: string;
  readonly context: LogContext;
  readonly data?: unknown;
}

const REDACTED_VALUE = '[REDACTED]';
const REDACTED_KEYS = [
  'authorization',
  'cookie',
  'token',
  'secret',
  'signature',
  'password',
  'customeremail',
  'customername',
  'email',
  'payload'
] as const;

function shouldRedact(key: string): boolean {
  const normalizedKey = key.toLowerCase();
  return REDACTED_KEYS.some((redactedKey) => normalizedKey.includes(redactedKey));
}

export function redactLogData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactLogData(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        shouldRedact(key) ? REDACTED_VALUE : redactLogData(nestedValue)
      ])
    );
  }

  return value;
}

function normalizeHeaders(headers: Readonly<Record<string, string | undefined>>): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(headers)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([key, value]) => [key.toLowerCase(), value])
  );
}

function getHeader(headers: Readonly<Record<string, string>>, headerName: string): string | undefined {
  return headers[headerName.toLowerCase()];
}

export function createLogContext(input: {
  readonly headers?: Readonly<Record<string, string | undefined>>;
  readonly tenantId?: string;
  readonly source: string;
}): LogContext {
  const normalizedHeaders = input.headers ? normalizeHeaders(input.headers) : {};

  return {
    correlationId:
      getHeader(normalizedHeaders, 'x-correlation-id') ?? getHeader(normalizedHeaders, 'x-request-id') ?? randomUUID(),
    tenantId: input.tenantId,
    actorId: getHeader(normalizedHeaders, 'x-clerk-user-id'),
    source: input.source
  };
}

type LogSink = (entry: StructuredLogEntry) => void;

function defaultSink(entry: StructuredLogEntry): void {
  const payload = entry.data ? { ...entry, data: redactLogData(entry.data) } : entry;
  console.log(JSON.stringify(payload));
}

let sink: LogSink = defaultSink;

export function setLogSink(customSink: LogSink): void {
  sink = customSink;
}

export function resetLogSink(): void {
  sink = defaultSink;
}

export function logEvent(input: {
  readonly level?: LogLevel;
  readonly event: string;
  readonly context: LogContext;
  readonly data?: unknown;
}): void {
  sink({
    timestamp: new Date().toISOString(),
    level: input.level ?? 'info',
    event: input.event,
    context: input.context,
    data: input.data ? redactLogData(input.data) : undefined
  });
}
