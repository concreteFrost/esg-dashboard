# ESG:ONE Dashboard Application

This repository contains the source code for the ESG:ONE Dashboard Application
HTML, CSS, JavaScript and all design-related files.

##### Table of Contents

<!-- TOC depthFrom:2 depthTo:4 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Folder Structure](#folder-structure)
- [Releases](#releases)
- [Installation](#installation)
	- [Local Development](#local-development)
	- [Development Build](#development-build)
	- [Production Build](#production-build)
- [Netlify Builds](#netlify-builds)
- [License](#license)

<!-- /TOC -->

## Folder Structure

This repository is broken down into the following folder structure.

```apache
/esg-dashboard/
├── .editorconfig
├── .netlify # Netlify.com specific files.
│   ├── functions
│   └── state.json
├── .prettierrc.js # For JavaScript code validation.
├── .styleci.yml # StyleCI configuration file.
├── LICENSE.md
├── README.md
├── dist # where production files are published.
├── gulpfile.js # contains all build commands.
├── netlify.toml # defines Netlify.com configuration.
├── package.json # contains all packages for the app.
├── src # the source code folder where changes are made.
│   ├── apple-touch-icon.png
│   ├── dashboard # all dashboard source code files reside here.
│   │   ├── assets # images and fonts for dashboard.
│   │   ├── pages # all the dashboard pages.
│   │   ├── partials # include files to build pages.
│   │   └── scss # SCSS style files for design and layouts.
│   ├── favicon.ico
│   ├── front # landing page website source code files reside here.
│   │   ├── assets # images and fonts for main website pages.
│   │   ├── pages # all the pages for the main website.
│   │   ├── partials # include files to build pages.
│   │   └── scss # SCSS style files for design and layouts.
│   ├── humans.txt # Human readable file for the website.
│   └── robots.txt # defines search engine indexing.
├── yarn.lock # used by package.json
└── zips # contains design and source code files.
```

## Releases

Releases are managed on the [GitHub source code repository][github] and can be 
found on the [Releases page over here][releases]. For the most current/latest 
release you can view it [by clicking here][latest].

## Installation 

The following will get the app running under different environments and for
specific instances.

### Local Development

You need to checkout this repository and run `gulp` to get the development
version up and running.

```console
$ git clone git@github.com:esg-one/esg-dashboard.git
$ cd ./esg-dashboard/
$ yarn install
$ gulp
```

The app will compile all the assets and you can start to debug the code in your
browser.

### Development Build

If you want to just build the project from the development branch it's a matter
of running the following command.

```console
$ gulp build:dev
```

This will output the final compiled assets to a folder called `/html&css/`

### Production Build

If you want to compile the assets for production release then you need to run:

```console
$ gulp build:dist
```

This will output the final compiled assets to a folder called `/dist/`

## Netlify Builds

The application is built using [Netlify][netlify] and will publish new versions
whenever you commit a change to either the `dev` or `main` branches. The `main`
branch publishes all commits to the [esg-one.co][main] domain.

Development branches publish to the Netlify testing website at the 
[esg-dev.netlify.app][dev] domain.

There is a Netlify configuration file which you can modify to adjust the
publication and build settings. The file is located here [netlify.toml][toml].

## License

The source code for the esg:one dashboard is unlicensed but certain components
are licensed under open-source licenses. Details of the licenses can be found
in the [LICENSE.md][license] file.

[netlify]: https://www.netlify.com
[main]: https://esg-one.co
[dev]: https://esg-dev.netlify.app
[toml]: /netlify.toml
[license]: /LICENSE.md
[github]: https://github.com/esg-one/esg-dashboard
[releases]: https://github.com/esg-one/esg-dashboard/releases
[latest]: https://github.com/esg-one/esg-dashboard/releases/latest
