export const fixImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  // Replace all instances of localhost with the server IP
  return url.replace(/127\.0\.0\.1:54321/g, '192.168.5.243:54321')
           .replace(/localhost:54321/g, '192.168.5.243:54321');
};
