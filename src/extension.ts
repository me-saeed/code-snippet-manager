import * as vscode from "vscode";

// In-memory snippet storage
let snippets: { title: string; code: string; tags: string[] }[] = [];

export function activate(context: vscode.ExtensionContext) {
  console.log('Code Snippet Manager extension is now active!');

  // Command to save a snippet
  let disposableSave = vscode.commands.registerCommand(
    "extension.saveSnippet",
    () => {
      console.log('Save snippet command triggered');
      vscode.window.showInformationMessage("Save Snippet command started!");
      
      vscode.window.showInputBox({
        placeHolder: "Enter snippet title",
        prompt: "What would you like to call this snippet?"
      }).then((title) => {
        if (!title) {
          vscode.window.showWarningMessage("Snippet title is required!");
          return;
        }
        
        vscode.window.showInputBox({
          placeHolder: "Enter tags (comma-separated)",
          prompt: "Optional: Add tags to help organize your snippets"
        }).then((tags) => {
          vscode.window.showInputBox({
            placeHolder: "Enter code snippet",
            prompt: "Paste or type your code snippet here"
          }).then((code) => {
            if (!code) {
              vscode.window.showWarningMessage("Code snippet is required!");
              return;
            }

            snippets.push({
              title,
              tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
              code,
            });
            
            vscode.window.showInformationMessage(
              `Snippet '${title}' saved successfully! Total snippets: ${snippets.length}`
            );
            console.log('Snippet saved:', { title, tags, code });
          });
        });
      });
    }
  );

  // Command to insert a snippet
  let disposableInsert = vscode.commands.registerCommand(
    "extension.insertSnippet",
    () => {
      console.log('Insert snippet command triggered');
      console.log('Total snippets available:', snippets.length);
      
      vscode.window.showInformationMessage(`Insert Snippet command started! You have ${snippets.length} saved snippets.`);

      if (snippets.length === 0) {
        vscode.window.showWarningMessage("No snippets saved yet. Please save a snippet first using 'Save Snippet' command.");
        return;
      }

      // Show all snippets directly without tag filtering for now
      const snippetTitles = snippets.map((snippet) => snippet.title);
      
      vscode.window.showQuickPick(snippetTitles, {
        placeHolder: "Select a snippet to insert",
        title: "Available Snippets"
      }).then((selectedTitle) => {
        if (selectedTitle) {
          const snippet = snippets.find((snippet) => snippet.title === selectedTitle);
          
          if (snippet) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
              editor.insertSnippet(new vscode.SnippetString(snippet.code));
              vscode.window.showInformationMessage(`Inserted snippet: ${snippet.title}`);
              console.log('Snippet inserted:', snippet.title);
            } else {
              vscode.window.showErrorMessage("No active text editor found. Please open a file first.");
            }
          } else {
            vscode.window.showErrorMessage("Snippet not found!");
          }
        }
      });
    }
  );

  // Command to save selected text as snippet
  let disposableSaveSelected = vscode.commands.registerCommand(
    "extension.saveSelectedText",
    () => {
      console.log('Save selected text command triggered');
      const editor = vscode.window.activeTextEditor;
      
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor found!");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showWarningMessage("No text selected! Please select some text first.");
        return;
      }

      vscode.window.showInputBox({
        placeHolder: "Enter snippet title",
        prompt: "What would you like to call this snippet?",
        value: `Snippet ${snippets.length + 1}`
      }).then((title) => {
        if (!title) {
          vscode.window.showWarningMessage("Snippet title is required!");
          return;
        }
        
        vscode.window.showInputBox({
          placeHolder: "Enter tags (comma-separated)",
          prompt: "Optional: Add tags to help organize your snippets"
        }).then((tags) => {
          snippets.push({
            title,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            code: selectedText,
          });
          
          vscode.window.showInformationMessage(
            `Selected text saved as snippet '${title}'! Total snippets: ${snippets.length}`
          );
          console.log('Selected text saved as snippet:', { title, tags, code: selectedText });
        });
      });
    }
  );

  // Command to show all snippets in a webview
  let disposableShowSnippets = vscode.commands.registerCommand(
    "extension.showSnippets",
    () => {
      console.log('Show snippets command triggered');
      
      if (snippets.length === 0) {
        vscode.window.showWarningMessage("No snippets saved yet. Please save a snippet first.");
        return;
      }

      // Create and show a webview panel
      const panel = vscode.window.createWebviewPanel(
        'snippetManager',
        'Code Snippet Manager',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      // Create HTML content for the webview
      const snippetList = snippets.map((snippet, index) => `
        <div class="snippet-item" data-index="${index}">
          <h3>${snippet.title}</h3>
          <p><strong>Tags:</strong> ${snippet.tags.join(', ') || 'None'}</p>
          <pre><code>${snippet.code}</code></pre>
          <button onclick="insertSnippet(${index})">Insert This Snippet</button>
          <button onclick="deleteSnippet(${index})">Delete</button>
        </div>
      `).join('');

      panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .snippet-item { border: 1px solid #ccc; margin: 10px 0; padding: 15px; border-radius: 5px; }
            .snippet-item h3 { margin-top: 0; color: #333; }
            .snippet-item pre { background: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
            .snippet-item button { margin: 5px 5px 5px 0; padding: 5px 10px; cursor: pointer; }
            .snippet-item button:first-of-type { background: #007acc; color: white; border: none; border-radius: 3px; }
            .snippet-item button:last-of-type { background: #dc3545; color: white; border: none; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>Code Snippet Manager</h1>
          <p>You have ${snippets.length} saved snippets.</p>
          ${snippetList}
          
          <script>
            const vscode = acquireVsCodeApi();
            
            function insertSnippet(index) {
              vscode.postMessage({
                command: 'insertSnippet',
                index: index
              });
            }
            
            function deleteSnippet(index) {
              if (confirm('Are you sure you want to delete this snippet?')) {
                vscode.postMessage({
                  command: 'deleteSnippet',
                  index: index
                });
              }
            }
          </script>
        </body>
        </html>
      `;

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case 'insertSnippet':
              const snippet = snippets[message.index];
              if (snippet) {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                  editor.insertSnippet(new vscode.SnippetString(snippet.code));
                  vscode.window.showInformationMessage(`Inserted snippet: ${snippet.title}`);
                  panel.dispose();
                } else {
                  vscode.window.showErrorMessage("No active text editor found!");
                }
              }
              break;
            case 'deleteSnippet':
              snippets.splice(message.index, 1);
              vscode.window.showInformationMessage("Snippet deleted!");
              panel.dispose();
              vscode.commands.executeCommand('extension.showSnippets');
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposableSave);
  context.subscriptions.push(disposableInsert);
  context.subscriptions.push(disposableSaveSelected);
  context.subscriptions.push(disposableShowSnippets);
}

export function deactivate() {}
