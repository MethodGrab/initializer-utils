# initializer-utils

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/MethodGrab/initializer-utils/CI?style=flat-square)](https://github.com/MethodGrab/initializer-utils/actions/workflows/CI.yaml)
[![npm version](https://img.shields.io/npm/v/methodgrab/initializer-utils?style=flat-square)](https://www.npmjs.com/package/@methodgrab/initializer-utils)

> Utilities for creating [npm initializers](https://docs.npmjs.com/cli/commands/npm-init).


## Usage

1.  
	```
	npm install @methodgrab/initializer-utils --save
	````
1. Import the utilities for creating your initializer CLI.
	```typescript
	// cli.ts
	import { askFor, copyFiles } from '@methodgrab/initializer-utils';

	// ...
	```
1. Import the utilities for testing your initializer CLI.
	```typescript
	// cli.test.ts
	import { fileExists, runCLI } from '@methodgrab/initializer-utils/testing';
	
	// ...
	```

For a full example checkout the [examples](./examples/basic) folder.


## Project Goals

What this is:

- :white_check_mark: A simple, lightweight, collection of utilities for building new project initializers.

What this is **not**:

- :x: A fully fledged generator/skaffolding tool.  
There are plenty of great tools like Yeoman & Hygen that already do this.


## What's included

### `@methodgrab/initializer-utils`

These are utilities to help you _create_ your initializer.


#### `askFor`

Use interactive prompts to gather information from a user.


##### `validateAll`, `validator`, `required`, `minLength`, `maxLength`

These are validation helpers that can be used with the `validate` property in `askFor` prompts.


#### `copyFiles`, `copyFile`

Copy a directory of templates, or a single template, to the CWD the user ran the initializer in.

Variables defined using curly braces (`{{ foo }}`) will be replaced with the values in the supplied `data` object.  
When combined with `askFor` this lets you easily include the users answers in the copied files.


### `@methodgrab/initializer-utils/testing`

These are utilities to help you _test_ your initializer.

#### `runCLI`

This runs your initializer (by default in a temp directory) with any prompt answers you specify.


#### `fileExists`

This is a very basic utility to assert that a file in the output directory `runCLI` ran in exists.
