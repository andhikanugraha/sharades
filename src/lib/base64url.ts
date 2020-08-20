export function btoaUrl(binaryArray: Uint8Array) {
  const binaryString = String.fromCharCode(...binaryArray);

  return btoa(binaryString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function atobUrl(asciiString: string) {
  const binaryString = atob(asciiString.replace(/-/g, '+').replace(/_/g, '/'));
  const buffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    buffer[i] = binaryString.charCodeAt(i);
  }

  return buffer;
}
