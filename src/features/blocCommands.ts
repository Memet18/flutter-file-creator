import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { isValidCommandsName } from '../utils';

export async function createBlocFromContext(uri: vscode.Uri) {
    if (!uri || !uri.fsPath || !fs.statSync(uri.fsPath).isDirectory()) {
        vscode.window.showErrorMessage("Please select a folder to create the BLoC.");
        return;
    }

    let blocName = await vscode.window.showInputBox({ prompt: "Enter the name of the BLoC" });
    if (!blocName) {
        return;
    }

    // Check for non-English characters using the utility function
    if (!isValidCommandsName(blocName)) {
        vscode.window.showErrorMessage("BLoC name must contain only English letters, numbers, and underscores.");
        return;
    }

    // Create the BLoC structure directly in the selected folder
    const success = createBlocStructure(uri.fsPath, blocName);
    if (success) {
        vscode.window.showInformationMessage(`BLoC '${blocName}' created successfully in ${uri.fsPath}!`);
    } else {
        vscode.window.showErrorMessage("Failed to create BLoC.");
    }
}

export function createBlocStructure(basePath: string, blocName: string): boolean {
    try {
        const blocPath = path.join(basePath, blocName);
        if (!fs.existsSync(blocPath)) {
            fs.mkdirSync(blocPath);
        }

        const blocFilePath = path.join(blocPath, `${blocName}_bloc.dart`);
        const eventFilePath = path.join(blocPath, `${blocName}_event.dart`);
        const stateFilePath = path.join(blocPath, `${blocName}_state.dart`);

        fs.writeFileSync(blocFilePath, getBlocTemplate(blocName));
        fs.writeFileSync(eventFilePath, getEventTemplate(blocName));
        fs.writeFileSync(stateFilePath, getStateTemplate(blocName));

        return true;
    } catch (error) {
        console.error("Failed to create BLoC structure:", error);
        return false;
    }
}

function getBlocTemplate(name: string): string {
    return `import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part '${name}_event.dart';
part '${name}_state.dart';

class ${capitalize(name)}Bloc extends Bloc<${capitalize(name)}Event, ${capitalize(name)}State> {
  ${capitalize(name)}Bloc() : super(Initial${capitalize(name)}State()) {
    on<${capitalize(name)}Event>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}

function getEventTemplate(name: string): string {
    return `part of '${name}_bloc.dart';

sealed class ${capitalize(name)}Event extends Equatable {
  const ${capitalize(name)}Event();

  @override
  List<Object> get props => [];
}
`;
}

function getStateTemplate(name: string): string {
    return `part of '${name}_bloc.dart';

sealed class ${capitalize(name)}State extends Equatable {
  const ${capitalize(name)}State();

  @override
  List<Object> get props => [];
}

final class Initial${capitalize(name)}State extends ${capitalize(name)}State {}
`;
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}