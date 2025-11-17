/**
 * Helper function to safely parse JSON responses from fetch
 * Handles cases where the server returns HTML instead of JSON
 */
export async function safeJsonResponse<T = any>(response: Response): Promise<T> {
  // Check if response is OK first
  if (!response.ok) {
    const text = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      // Try to parse as JSON if possible
      const errorData = JSON.parse(text);
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If not JSON, it's probably HTML (error page)
      // Extract a meaningful error message
      if (text.includes('<title>')) {
        const titleMatch = text.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
          errorMessage = `HTTP ${response.status}: ${titleMatch[1]}`;
        } else {
          errorMessage = `HTTP ${response.status}: Server returned HTML instead of JSON`;
        }
      } else {
        errorMessage = `HTTP ${response.status}: ${text.substring(0, 200)}`;
      }
    }
    
    throw new Error(errorMessage);
  }

  // Verify Content-Type is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(
      `Expected JSON but got ${contentType || 'unknown content-type'}. ` +
      `Response preview: ${text.substring(0, 100)}`
    );
  }

  // Parse JSON
  try {
    return await response.json();
  } catch (error) {
    const text = await response.text();
    throw new Error(
      `Failed to parse JSON response. ` +
      `Response preview: ${text.substring(0, 100)}`
    );
  }
}

/**
 * Wrapper for fetch that automatically handles JSON parsing safely
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  return safeJsonResponse<T>(response);
}

