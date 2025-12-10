import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

import { RequestContextService } from "./request-context.service";

const CORRELATION_ID_HEADERS = ["x-correlation-id", "x-request-id", "traceparent"] as const;

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}

  use(req: FastifyRequest["raw"], res: FastifyReply["raw"], next: () => void) {
    const incomingCorrelationId = this.extractCorrelationId(req.headers as Record<string, string | undefined>);
    const context = RequestContextService.createContext(incomingCorrelationId);

    // Set correlation ID in response headers for client traceability
    res.setHeader("x-correlation-id", context.correlationId);
    res.setHeader("x-request-id", context.requestId);

    // Run the rest of the request within this context
    this.requestContextService.run(context, next);
  }

  private extractCorrelationId(headers: Record<string, string | undefined>): string | undefined {
    for (const headerName of CORRELATION_ID_HEADERS) {
      const value = headers[headerName];
      if (value) {
        // Handle traceparent format: extract trace-id portion
        if (headerName === "traceparent") {
          return this.parseTraceparent(value);
        }
        return value;
      }
    }
    return undefined;
  }

  /**
   * Parse W3C Trace Context traceparent header.
   * Format: version-trace_id-parent_id-trace_flags
   * Example: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
   */
  private parseTraceparent(traceparent: string): string | undefined {
    const parts = traceparent.split("-");
    return parts.length >= 2 ? parts[1] : undefined;
  }
}
