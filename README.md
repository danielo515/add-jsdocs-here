# Add jsdocs here

[![Greenkeeper badge](https://badges.greenkeeper.io/danielo515/add-jsdocs-here.svg)](https://greenkeeper.io/)

Simple npm package that adds the required files and configurations to generate
documentation using [jsdoc3](http://usejsdoc.org/).

# Usage

Just run it on the **root folder** of the project that you want to be patched for jsdoc3.

```
add-jsdocs-here
```

## Configuring

A wizzard will guide you across all the configurations. Most of the defaults are fine for many projects,
but you want to put special attention to the following:

 - **Source code folder**: Where is located the source code that you want to be documented. This is probably **the most important** configuration
 - **Task name**: How you want to name that will build the documents. It is called with `gulp task-name`
 - **Docs folder**: Were the generated docs are going to be saved

## Dependencies

The documentation generation require `gulp` to be installed globally and locally and `gulp-jsdoc3`.
This is not required by the module to work, but they will be required for generate the documentation.
The module will ask you if you want to install the required dependencies and will install them for you,
except for the global `gulp` which has to be installed manually..

# installation

I recommend you to install it globally.
You are not going to use it twice for the same project, but it may be useful for several projects.
That's why I recommend to install it globally.

```
npm install -g add-jsdocs-here
```