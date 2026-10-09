export function errorMessage(exception: unknown): string {
  return exception instanceof Error ? exception.message : 'Something went wrong.'
}
