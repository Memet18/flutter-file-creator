import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { toSnakeCase, toPascalCase, isValidCommandsName } from '../utils';

export async function createFeatureFolder() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("Open a workspace first!");
        return;
    }

    let featureName = await vscode.window.showInputBox({ prompt: "Enter feature name" });
    if (!featureName) {
        return;
    }

    // Check for non-English characters using the utility function
    if (!isValidCommandsName(featureName)) {
        vscode.window.showErrorMessage("Feature name must contain only English letters, numbers, and underscores.");
        return;
    }

    // Show an open dialog to select a folder
    const uri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Select Folder'
    });

    if (!uri || uri.length === 0) {
        vscode.window.showErrorMessage("No folder selected.");
        return;
    }

    // Use the shared function to create the feature structure
    const success = createFeatureStructure(uri[0].fsPath, featureName);
    if (success) {
        vscode.window.showInformationMessage(`Feature '${featureName}' created successfully!`);
    } else {
        vscode.window.showErrorMessage("Failed to create feature.");
    }
}

export async function createFeatureFolderFromContext(uri: vscode.Uri) {
    if (!uri || !uri.fsPath || !fs.statSync(uri.fsPath).isDirectory()) {
        vscode.window.showErrorMessage("Please select a folder to create the feature.");
        return;
    }

    let featureName = await vscode.window.showInputBox({ prompt: "Enter feature name" });
    if (!featureName) {
        return;
    }

    // Check for non-English characters using the utility function
    if (!isValidCommandsName(featureName)) {
        vscode.window.showErrorMessage("Feature name must contain only English letters, numbers, and underscores.");
        return;
    }

    // Create the feature structure directly in the selected folder
    const success = createFeatureStructure(uri.fsPath, featureName);
    if (success) {
        vscode.window.showInformationMessage(`Feature '${featureName}' created successfully in ${uri.fsPath}!`);
    } else {
        vscode.window.showErrorMessage("Failed to create feature.");
    }
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