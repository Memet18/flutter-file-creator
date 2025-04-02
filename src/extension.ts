import * as vscode from 'vscode';
import { createFeatureFolder, createFeatureFolderFromContext } from './features/featureCommands';
import { createBlocFromContext } from './features/blocCommands';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "flutter-feature" is now active!');

    // Command for creating a feature via the command palette
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-feature.createFeatureFolder', createFeatureFolder)
    );

    // Command for creating a feature from the right-click menu
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-feature.createFeatureFolderFromContext', createFeatureFolderFromContext)
    );

    // Command for creating a BLoC from the right-click menu
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-feature.createBlocFromContext', createBlocFromContext)
    );
}

export function deactivate() {}