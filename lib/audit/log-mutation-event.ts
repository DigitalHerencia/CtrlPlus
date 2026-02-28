import {
  createLogContext,
  logEvent,
  type LogContext,
  type LogLevel
} from '../observability/structured-logger';

interface MutationAuditLoggerInput {
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly tenantId: string;
  readonly source: string;
  readonly eventPrefix: string;
}

interface MutationEventInput {
  readonly level?: LogLevel;
  readonly suffix: string;
  readonly data?: unknown;
}

export interface MutationAuditLogger {
  readonly context: LogContext;
  log: (input: MutationEventInput) => void;
  requested: (data?: unknown) => void;
  succeeded: (data?: unknown) => void;
  rejected: (data?: unknown) => void;
}

export function createMutationAuditLogger(input: MutationAuditLoggerInput): MutationAuditLogger {
  const context = createLogContext({
    headers: input.headers,
    tenantId: input.tenantId,
    source: input.source
  });

  const log = (eventInput: MutationEventInput): void => {
    logEvent({
      level: eventInput.level ?? 'info',
      event: `${input.eventPrefix}.${eventInput.suffix}`,
      context,
      data: eventInput.data
    });
  };

  return {
    context,
    log,
    requested(data) {
      log({
        suffix: 'requested',
        data
      });
    },
    succeeded(data) {
      log({
        suffix: 'succeeded',
        data
      });
    },
    rejected(data) {
      log({
        level: 'warn',
        suffix: 'rejected',
        data
      });
    }
  };
}
