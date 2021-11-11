# XML-JSON-Generator
This is a Node JS APP, handling for converting XML format data to JSON type data structure. 

## How to start

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install --global
```

Or you can just install under the project

```sh
$ npm install
```

## Usage

There are two ways to convert your XML files:

Give the XML path as argument 
```sh
$ node index --file-to-convert=path/to/file.xml
```

You can run the application without giving XML file path, but you need to put the XML file under "convert" directory.
Application will automatically fetch XML file from there. 

```sh
$ node index
```

## Features
This application will automatically decode your encoded HTML string 

## Log
Succss and Exception will be stored in log file under "log"

###Futher plan 
Add function support multiple XML file batch conversion
