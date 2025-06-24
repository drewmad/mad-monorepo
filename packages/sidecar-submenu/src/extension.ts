import * as vscode from 'vscode';

class SubmenuItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly children: SubmenuItem[] = []
  ) {
    super(
      label,
      children.length
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );

    if (!children.length) {
      this.command = {
        command: 'sidecarSubmenu.itemClicked',
        title: 'Select',
        arguments: [this]
      };
    }
  }
}

class SubmenuProvider implements vscode.TreeDataProvider<SubmenuItem> {
  private readonly rootItems: SubmenuItem[];

  constructor() {
    this.rootItems = [
      new SubmenuItem('Group 1', [
        new SubmenuItem('Item 1'),
        new SubmenuItem('Item 2')
      ]),
      new SubmenuItem('Group 2', [
        new SubmenuItem('Item 3')
      ])
    ];
  }

  getTreeItem(element: SubmenuItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SubmenuItem): Thenable<SubmenuItem[]> {
    if (!element) {
      return Promise.resolve(this.rootItems);
    }
    return Promise.resolve(element.children);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new SubmenuProvider();
  const view = vscode.window.createTreeView('sidecarSubmenu', {
    treeDataProvider: provider,
    showCollapseAll: true
  });

  const clickHandler = vscode.commands.registerCommand(
    'sidecarSubmenu.itemClicked',
    (item: SubmenuItem) => {
      vscode.window.showInformationMessage(`Selected ${item.label}`);
    }
  );

  context.subscriptions.push(view, clickHandler);
}

export function deactivate() {}
