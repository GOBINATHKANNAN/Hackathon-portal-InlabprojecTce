const getAssetUrl = (path) => {
    if (!path) return '';

    // If it's already a full URL (starts with http)
    if (path.startsWith('http')) {
        return path;
    }

    // If it's a local path, prepend the backend URL
    const backendUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:5000';

    // Sanitize the path (ensure single slash)
    const sanitizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${backendUrl}${sanitizedPath}`.replace(/\\/g, '/');
};

export default getAssetUrl;
