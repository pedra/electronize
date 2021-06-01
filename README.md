# Electronizer

Template to start an Electron project!

 <img align="right" src="https://billrocha.netlify.app/Handmade.png" alt="Hand Made">

### Directories 

**./src** - development codes;

**./dist** - compiled distribution files;

**./pack** - application files required by Electron-Builder;

**./assets** - "external" files added to the distribution package (not compressed in the ASAR).

<sub><i>TODO: write usage documentation and settings (next commits).</i></sub> 

### Application

The **application** is divided into two parts, which can be seen in the ./src folder:

**./src/app** - Electron's encapsulation (systray, boot, OS configurations ...). This is the base that supports the application on your OS;

**./src/net** - if the application has a web server, where other network users can access via API, socket or simple PWA/WEB applications, here is your working directory. 


## Install

Electronizer has two layers: the **development** layer, which is installed in the ./src folder and the **build** layer, at the root of the project.

You need to install NPM dependencies on these two layers:

```
npm i
cd src
npm i
```

<sub><i>Depending on the version, just run "npm i" on the top layer and it will be identified and installed on the bottom layers. See if this is your case.</i></sub>

## Start

To run the code under development, type this at the root of the project (not inside ./src): 

```
npm start 
```

If your operating system is **Windows**, enter the following command to run:

```
npm run elizer 
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
Coming soon in <a href="https://github.com/pedra/elizer">https://github.com/pedra/elizer</a></p>

--- 
<p>The code is partially in Brazilian <b>Portuguese</b>.<br>
Help to <b>translate</b> is very much desired!</p>

