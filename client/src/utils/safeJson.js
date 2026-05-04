export const parseJsonSafe = async (response) => {
  const raw = await response.text();

  if (!raw || !raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getErrorMessage = (response, data, fallback) => {
  if (data && typeof data === "object" && typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (!response.ok) {
    return `${fallback} (HTTP ${response.status})`;
  }

  return fallback;
};
