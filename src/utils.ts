import * as fs from 'fs';
import * as path from 'path';

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
export function isValidFeatureName(str: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(str);
}

/**
 * Creates the folder structure for a feature.
 * @param basePath The root directory where the feature should be created.
 * @param featureName The name of the feature.
 */
export function createFeatureStructure(basePath: string, featureName: string) {
    const folderName = toSnakeCase(featureName);
    const className = toPascalCase(featureName);

    // Determine if the basePath includes 'lib'
    const isInsideLib = basePath.includes(path.join('lib'));

    // If not inside 'lib', create the feature inside 'lib'
    const rootPath = isInsideLib ? path.join(basePath, folderName) : path.join(basePath, 'lib', folderName);

    const structure = [
        "data/models",
        "data/repository_impl",
        "data/remote_data",
        "data/local_data",
        "domain/entities",
        "domain/repository",
        "domain/usecases",
        "presentation/view",
        "presentation/widgets",
        "presentation/blocs"
    ];

    try {
        // Create directories
        structure.forEach(folder => {
            fs.mkdirSync(path.join(rootPath, folder), { recursive: true });
        });

        // Create repository files
        const repositoryPath = path.join(rootPath, "domain/repository", `${folderName}_repository.dart`);
        const repositoryImplPath = path.join(rootPath, "data/repository_impl", `${folderName}_repository_impl.dart`);

        fs.writeFileSync(repositoryPath, `abstract class ${className}Repository {}`);
        fs.writeFileSync(repositoryImplPath, 
            `import '../../domain/repository/${folderName}_repository.dart';\n\n` +
            `class ${className}RepositoryImpl implements ${className}Repository {\n\n}`
        );

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}