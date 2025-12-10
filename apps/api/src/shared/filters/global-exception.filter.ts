import { ApiErrorResponse, ErrorType, FieldError } from "@nest-nx-monorepo/shared-types";
import { ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodValidationException } from "nestjs-zod";
import { ZodError } from "zod";

import { AppConfigService } from "../config";
import { RequestContextService } from "../context";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly configService: AppConfigService,
    private readonly requestContextService: RequestContextService
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const isProduction = this.configService.isProduction;

    const correlationId = this.requestContextService.getCorrelationId();
    const requestId = this.requestContextService.getRequestId();

    const errorResponse = this.buildErrorResponse(exception, request.url, isProduction, correlationId, requestId);
    const status = this.getHttpStatus(exception);

    this.logError(errorResponse, exception, request);

    return response.status(status).send(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    path: string,
    isProduction: boolean,
    correlationId: string,
    requestId: string
  ): ApiErrorResponse {
    const timestamp = new Date().toISOString();

    const baseError = {
      timestamp,
      path,
      correlationId,
      requestId
    };

    if (exception instanceof ZodValidationException) {
      return {
        success: false,
        error: {
          ...baseError,
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          type: "VALIDATION",
          fields: this.mapZodError(exception.getZodError() as ZodError)
        }
      };
    }

    if (exception instanceof HttpException) {
      const { code, message, type } = this.extractFromHttpException(exception.getResponse(), exception);

      return {
        success: false,
        error: {
          ...baseError,
          code,
          message: isProduction && type === "SYSTEM" ? "An unexpected error occurred" : message,
          type
        }
      };
    }

    return {
      success: false,
      error: {
        ...baseError,
        code: "INTERNAL_ERROR",
        message: isProduction ? "An unexpected error occurred" : this.getExceptionMessage(exception),
        type: "SYSTEM" as const
      }
    };
  }

  private logError(errorResponse: ApiErrorResponse, exception: unknown, request: FastifyRequest): void {
    const { correlationId, requestId, code, message, type } = errorResponse.error;
    const logContext = {
      correlationId,
      requestId,
      method: request.method,
      url: request.url,
      errorCode: code
    };

    if (type === "SYSTEM") {
      this.logger.error(
        {
          ...logContext,
          stack: exception instanceof Error ? exception.stack : undefined
        },
        `System error: ${message}`
      );
    } else {
      this.logger.warn(logContext, `${type} error: ${code} - ${message}`);
    }
  }

  private mapZodError(zodError: ZodError): FieldError[] {
    return zodError.issues.map((err) => ({
      field: err.path.join("."),
      code: err.code,
      message: err.message
    }));
  }

  private extractFromHttpException(
    response: string | object,
    exception: HttpException
  ): {
    code: string;
    message: string;
    type: ErrorType;
  } {
    if (typeof response === "object" && response !== null) {
      const res = response as Record<string, unknown>;
      return {
        code: (res["code"] as string) || this.getDefaultCode(exception),
        message: (res["message"] as string) || exception.message,
        type: (res["type"] as ErrorType) || "BUSINESS"
      };
    }

    return {
      code: this.getDefaultCode(exception),
      message: typeof response === "string" ? response : exception.message,
      type: "BUSINESS"
    };
  }

  private getDefaultCode(exception: HttpException): string {
    const status = exception.getStatus();
    const codeMap: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "UNPROCESSABLE_ENTITY",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_SERVER_ERROR"
    };
    return codeMap[status] || "UNKNOWN_ERROR";
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getExceptionMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }
    return String(exception);
  }
}
