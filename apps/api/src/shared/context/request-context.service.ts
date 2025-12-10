import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

export interface RequestContext {
  correlationId: string;
  requestId: string;
  timestamp: Date;
  // userId?: string;
}

@Injectable()
export class RequestContextService {
  private static storage = new AsyncLocalStorage<RequestContext>();

  /**
   * Run a function within a request context.
   * Called by middleware at the start of each request.
   */
  run<T>(context: RequestContext, fn: () => T): T {
    return RequestContextService.storage.run(context, fn);
  }

  /**
   * Get the current request context.
   * Returns undefined if called outside of a request context.
   */
  getContext(): RequestContext | undefined {
    return RequestContextService.storage.getStore();
  }

  /**
   * Get correlation ID for the current request.
   * Falls back to a new UUID if no context exists (shouldn't happen in normal flow).
   */
  getCorrelationId(): string {
    return this.getContext()?.correlationId ?? randomUUID();
  }

  /**
   * Get request ID for the current request.
   */
  getRequestId(): string {
    return this.getContext()?.requestId ?? randomUUID();
  }

  /**
   * Create a new request context.
   * Extracts correlation ID from headers or generates a new one.
   */
  static createContext(incomingCorrelationId?: string): RequestContext {
    return {
      correlationId: incomingCorrelationId || randomUUID(),
      requestId: randomUUID(),
      timestamp: new Date()
    };
  }
}
