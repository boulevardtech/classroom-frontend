export const DEPARTMENTS = [
    'CS',
    'IT',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
];
export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((department) => ({
    value: department,
    label: department,
}));
export const MAX_FILE_SIZE = 3 * 1024;//3MB in bytes
export const ALLOWED_TYPES = [
    "image/png",
"image/jpeg",
"image/jpg",
"image/webp",];
export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;