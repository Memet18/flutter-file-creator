import * as vscode from 'vscode';
import { createFeatureStructure, isValidFeatureName } from './utils'; 
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "flutter-feature" is now active!');
    
    // Command for creating a feature via the command palette
    let disposable = vscode.commands.registerCommand('flutter-feature.createFeatureFolder', async () => {
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
        if (!isValidFeatureName(featureName)) {
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
    });

    // Command for creating a feature from the right-click menu
    let contextMenuDisposable = vscode.commands.registerCommand('flutter-feature.createFeatureFolderFromContext', async (uri: vscode.Uri) => {
        if (!uri || !uri.fsPath || !fs.statSync(uri.fsPath).isDirectory()) {
            vscode.window.showErrorMessage("Please select a folder to create the feature.");
            return;
        }

        let featureName = await vscode.window.showInputBox({ prompt: "Enter feature name" });
        if (!featureName) {
            return;
        }

        // Check for non-English characters using the utility function
        if (!isValidFeatureName(featureName)) {
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
    });

    // Register commands
    context.subscriptions.push(disposable);
    context.subscriptions.push(contextMenuDisposable);
}

export function deactivate() {}