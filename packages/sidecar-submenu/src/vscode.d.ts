/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vscode' {
  export type Thenable<T> = PromiseLike<T>;

  export enum TreeItemCollapsibleState {
    None = 0,
    Collapsed = 1,
    Expanded = 2
  }

  export interface Command {
    command: string;
    title: string;
    arguments?: any[];
  }

  export class TreeItem {
    constructor(label: string, collapsibleState?: TreeItemCollapsibleState);
    command?: Command;
  }

  export interface TreeDataProvider<T> {
    getTreeItem(element: T): TreeItem;
    getChildren(element?: T): Thenable<T[]>;
  }

  export interface ExtensionContext {
    subscriptions: { push(...items: any[]): void };
  }

  export namespace window {
    function createTreeView(id: string, options: any): any;
    function showInformationMessage(message: string): Thenable<void>;
  }

  export namespace commands {
    function registerCommand(command: string, callback: (...args: any[]) => any): any;
  }
}
