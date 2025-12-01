# Localization Guidelines for SPA Apps

## Library Usage

- Use the **Inlang Paraglide JS** library (version 2.0 or later) to handle all localized strings.
- Paraglide version 2.0 does not require any additional plugins for Vite or Next.js, as stated in the official Paraglide documentation.
- For installation and usage examples, always validate against the installation guidelines. If MCP Context7 is available, reference it; otherwise, consult the content in the official installation documentation link.

## String Key Naming Conventions

Follow these rules to create consistent and predictable key names for localized strings:

- **Base the key on the string value**: The key should match the core words in the string's value, excluding unnecessary elements like prepositions. The key name should reflect the text content itself, not its placement or positioning in the UI.
- **Replace spaces with underscores**: Convert any spaces in the string value to underscores (`_`) in the key.
- **Omit prepositions**: Skip words like "with," "for," "of," "in," "on," "at," "by," "to," and other prepositions in the key. However, retain them in the actual string value if they are part of it.
- **Use uppercase**: All key names must be in full uppercase letters.
- **Handle dynamic variables**: Represent any dynamic parts (e.g., usernames, amounts) as parameters in the string value (using `${variableName}` syntax). In the key, prefix these with a dollar sign (`$`) followed by the variable name in uppercase (e.g., `$USERNAME`). Pass these as parameters when using the localized string.
- **Reuse keys for identical values**: If two hardcoded strings have exactly the same value, share the same key. If there is any difference (even minor), create a new unique key-value pair.
- **Keep keys flat**: All string keys must be flat (non-nested); avoid use any hierarchical or nested structures.
- **Avoid duplicating existing keys**: If adding a new key that matches an existing one and the values are identical, reuse the existing key instead of creating a new one.

## Examples

Here are examples demonstrating the key naming rules:

- String value: "ok"  
  Key: `OK`

- String value: "get started"  
  Key: `GET_STARTED`

- String value: "12 kilos" (where "12" is dynamic)  
  Key: `$AMOUNT_KILOS`  
  Usage: Pass the dynamic amount as a parameter.

- String value: "welcome ${userName}"  
  Key: `WELCOME_$USERNAME` 
Usage: Pass the`userName` as a parameter.

- String value: "welcome ${userName} you have ${amount} points"  
  Key: `WELCOME_$USERNAME*YOU_HAVE*$AMOUNT_POINTS` 
Usage: Pass`userName`and`amount` as parameters. Note that "you have" is included as core words (not prepositions), so they appear in the key.

## Migration and Refactoring Rules

These rules apply only during migration or refactoring of an existing localization solution. They avoid applying if you are adding Paraglide localization to a project that has no existing localization system.

- avoid creating any transformers, hooks, or intermediary functions to bridge between Paraglide and the old localization solution.
- Always create a backup file of the existing localized strings files before starting the refactoring.
- avoid using or build any automated scripts for migration; instead, handle the process manually, one string at a time, using the current AI agent.
- avoid adding fallback hardcoded strings; use only the Paraglide message function.
- avoid changing any existing content in the app, whether it is hardcoded or part of an existing localization setup. Preserve all localized values exactly as they are, without any modifications.
- If content is written in the app in a specific language (as hardcoded or localized strings) and does not exist in other languages—even if it does not exist in English—retain the value in the Paraglide strings file unchanged. This is a migration of the localization structure only, not the app content. For example, if a string is found in Arabic, keep its value the same in the new setup.
