export const IMAGE_BASE = 'https://api.halimatu-sadiyyah.com.ng';

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE}${cleanPath}`;
};