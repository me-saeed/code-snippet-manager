# Code Snippet Manager

A simple VS Code extension for storing and managing your code snippets for improved productivity.

## Features

- **Save Snippets**: Store code snippets with titles and tags for easy organization
- **Insert Snippets**: Quickly insert saved snippets into your code
- **Tag-based Filtering**: Filter snippets by tags to find what you need quickly
- **In-memory Storage**: Snippets are stored in memory during your VS Code session

## Commands

This extension provides the following commands:

- `Save Snippet` - Save a new code snippet with title and tags
- `Insert Snippet` - Insert a previously saved snippet into your code

## How to Use

1. **Saving a Snippet**:
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type "Save Snippet" and select the command
   - Enter a title for your snippet
   - Optionally add tags (comma-separated)
   - Enter your code snippet
   - The snippet will be saved and ready to use

2. **Inserting a Snippet**:
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type "Insert Snippet" and select the command
   - Optionally filter by tag
   - Select the snippet you want to insert
   - The snippet will be inserted at your cursor position

## Requirements

- VS Code 1.74.0 or higher

## Extension Settings

This extension does not currently contribute any settings.

## Known Issues

- Snippets are stored in memory and will be lost when VS Code is closed
- No persistent storage is implemented yet

## Release Notes

### 1.0.0

Initial release of Code Snippet Manager with basic save and insert functionality.

## Development

To build and test this extension:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` in VS Code to open a new Extension Development Host window
5. Test the extension commands in the new window

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
