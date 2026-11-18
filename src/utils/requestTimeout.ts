export async function withRequestTimeout<T>(request: Promise<T>, timeout = 15_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("The request timed out. Please try again.")), timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
