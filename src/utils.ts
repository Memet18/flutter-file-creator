
/**
 * Converts a string to PascalCase (e.g., "my_feature" → "MyFeature")
 */
export function toPascalCase(str: string): string {
    return str
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
        .replace(/\s+/g, ''); // Remove spaces
}

/**
 * Converts a string to snake_case (e.g., "MyFeature" → "my_feature")
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Add underscore between camelCase words
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase(); // Convert to lowercase
}

/**
 * Validates that a string contains only English letters, numbers, and underscores.
 * @param str The string to validate.
 * @returns True if the string is valid, false otherwise.
 */
export function isValidCommandsName(str: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(str);
}

