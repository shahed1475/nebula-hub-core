export class AIProviderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderError";
  }
}

export class AIProviderConfigError extends AIProviderError {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderConfigError";
  }
}

export class AIProviderRefusalError extends AIProviderError {
  readonly category: string | null;

  constructor(message: string, category: string | null) {
    super(message);
    this.name = "AIProviderRefusalError";
    this.category = category;
  }
}

export class AIProviderValidationError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderValidationError";
  }
}

export class AIProviderRateLimitError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderRateLimitError";
  }
}

export class AIProviderAuthenticationError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderAuthenticationError";
  }
}

export class AIProviderRequestError extends AIProviderError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AIProviderRequestError";
  }
}

export function parseOrThrow<T>(
  schema: { parse: (input: unknown) => T },
  rawInput: unknown,
  context: string = "Input"
): T {
  try {
    return schema.parse(rawInput);
  } catch (error) {
    throw new AIProviderValidationError(
      `${context} failed schema validation: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }
}
