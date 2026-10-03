const envUrl = import.meta.env.VITE_API_BASE_URL;

export function apiUrl(path) {
  if (envUrl) {
    return `${envUrl.replace(/\/$/, '')}${path}`;
  }
  // When accessed in browser or across devices on http://192.168.0.12:4173/,
  // on LAN or from VPN: http://10.73.190.143:4173/ 
  // using relative path leverages Vite's proxy directly on port 4173!
  if (typeof window !== 'undefined') {
    return path;
  }
  return `http://localhost:8080${path}`;
}
