# Electronize
Template to start an Electron project!

### Directories 

**./src** - development codes;

**./dist** - compiled distribution files;

**./pack** - application files required by Electron-Builder;

**./assets** - "external" files added to the distribution package (not compressed in the ASA).

<sub><i>TODO: write usage documentation and settings (next commits).</i></sub> 

### Application

The **application** is divided into three parts, which can be seen in the ./src folder:

**./src/app** - Electron's encapsulation (systray, boot, OS configurations ...). This is the base that supports the application on your OS;

**./src/desktop** - if the application will have one (or more) windows on the desktop, this will be programmed here (eg: admin, user access management, data monitoring ...);

**./src/host** - if the application has a web server, where other network users can access via API, Socket or simple PWA/WEB applications, here is your working directory. 


## Install

Electronize has two layers: the **development** layer, which is installed in the ./src folder and the **build** layer, at the root of the project.

You need to install NPM dependencies on these two layers:

```
npm i
cd src
npm i
```

## Start

To run the code under development, type this at the root of the project (not inside ./src): 

```
npm start 
```

## Build

To create a test build, type: 

```
npm run build
```

Check ./dist directory.

## Pack

This command creates the packaged files to be sent to users to install the application. We will soon have more details in the documentation on packaging particularities for different operating systems (MacOs, Linux and Windows).

```
npm run dist
```

And check the ./dist directory.

--- 

<p><b>Elize</b> - a CLI to use with this template!<br>
Coming soon in <a href="https://github.com/pedra/elize">https://github.com/pedra/elize</a></p>

--- 
<p>The code is partially in Brazilian <b>Portuguese</b>.<br>
Help to <b>translate</b> is very much desired!</p>

