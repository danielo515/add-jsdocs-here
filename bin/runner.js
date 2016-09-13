#!/usr/bin/env node

var shell = require("shelljs/global");
var path = require('path');
var prompt = require('prompt-promise');
var fs = require('fs');


const GULPFILE = 'gulpfile.js'

var templates = {
    jsdoc: path.join(__dirname, '../templates/config.json'),
    gulp: path.join(__dirname, '../templates/', GULPFILE),
    gulpHeader: path.join(__dirname, '../templates/gulpheader.js')
}

var replacements = [
    {
        question: 'Location of the readme',
        placeholder: '#README#',
        value: './README.md',
        file: GULPFILE,
        configurable: true
    },
    {
        question: 'Location of your sourcecode',
        placeholder: '#SOURCECODE#',
        value: './lib',
        file: GULPFILE,
        configurable: true
    },
    {
        placeholder: '#JSDOC#',
        value: './jsdoc/config', // this will be required, so skip the json extension
        file: GULPFILE,
        configurable: false
    },
    {
        question: 'Task name for generating docs (invoked with "gulp task-name")',
        placeholder: '#DOCSTASKNAME#',
        value: 'create docs',
        file: GULPFILE,
        configurable: true
    },
    {
        question: 'Destination folder for generated docs',
        placeholder: '#DOCSFOLDER#',
        value: './docs/',
        file: GULPFILE,
        configurable: true
    },
    {
        question: 'Project name (what are you documenting)',
        placeholder: '#SYSTEMNAME#',
        value: 'Case Medux',
        file: 'jsdoc/config.json',
        configurable: true
    },
    {
        question: 'Footer (will appear on all pages)',
        placeholder: '#FOOTER#',
        value: '',
        file: 'jsdoc/config.json',
        configurable: true
    },
    {
        question: 'Copyright',
        placeholder: '#COPYRIGHT#',
        value: 'Copyright © 2014 Case on it SL',
        file: 'jsdoc/config.json',
        configurable: true
    }

];

// Clean the stuff
if (test('-d', 'jsdoc')) {
    rm('-rf', 'jsdoc');
}

// Create the env
if (test('-f', GULPFILE)) {
    removeJsDocTasks(GULPFILE);
    echo('\n').toEnd(GULPFILE);
    cat(templates.gulp).toEnd(GULPFILE); // if the gulp file exits already just add the task at the end of it
} else { // create the full file otherwise
    cat(templates.gulpHeader, templates.gulp).to(GULPFILE);
}

mkdir('jsdoc');
cp(templates.jsdoc, 'jsdoc/')


/**
 * iterate the array of replacements.
 * If the replacement is configurable ask the user for a value
 * if it is not, just use the default value.
 *
 */
var userAnsers = replacements.reduce(
    (prev, rep) => {

        /** non configurable value, skip the user input */
        if (!rep.configurable) {
            return prev.then((arr) => {
                arr.push(rep.value);
                return arr;
            })
        }
        /** ask the user for input */
        return prev.then(
            (arr) =>
                prompt(rep.question + ' defaults to [' + rep.value + ']: ')
                    .then(value => { arr.push(value); return arr }))
    }, Promise.resolve([])
);

userAnsers.then(userAnsers => {
    userAnsers.forEach(
        (value, index) => {
            var rep = replacements[index];
            rep.value = value || rep.value;
            sed('-i', rep.placeholder, rep.value, rep.file);
        })
})
    .catch(console.log.bind(console))
    .then(() => {
        return prompt('Do you want to install dependencies?[yes/no]: ')
    })
    .then(answer => {

        if (!(/y(es)?/.test(answer))) {
            return
        }
        if (!test('-f', 'package.json')) {
            console.log('===============================================');
            console.log('\tYou don\'t have a package.json, dependencies will not be installed');
            console.log('\tTo do so, run the following commands: ');
            console.log('\t\tnpm init');
            console.log("\t\tnpm install --save-dev gulp");
            console.log("\t\tnpm install --save-dev gulp-jsdoc3");
            console.log('===============================================');
            return
        }
        console.log('Instaling dependencies, may take a while, sit and relax...');
        exec("npm install --save-dev gulp && npm install --save-dev gulp-jsdoc3 ");
        console.log('Dependencies installed!');
    })
    .then(() => {
        console.log('Everyting its on its place!!')
        process.exit();
    });


function removeJsDocTasks(target) {
    var header = escapeStar(escapeSlash(head({ '-n': 1 }, templates.gulp))).replace(/\r?\n/, '');
    var footer = escapeStar(escapeSlash(tail({ '-n': 1 }, templates.gulp))).replace(/\r?\n/, '');
    var regex = new RegExp(header + '[\\s\\S]*' + footer, 'm');

    if (grep(header, target).stdout.length > 2 && grep(footer, target).stdout.length > 2) {
        var content = fs.readFileSync(target, 'utf8');
        fs.writeFileSync(target,
            content.replace(regex, ''), 'utf8')
    }

    function escapeSlash(text) { return text.replace(/[\/]/g, '\\/'); }
    function escapeStar(text) { return text.replace(/[\*]/g, '\\*'); }
}

