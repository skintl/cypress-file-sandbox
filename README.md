# Cypress File Snapshot Testing Sandbox

[https://www.netlify.com/img/deploy/button.svg](https://app.netlify.com/start/deploy?repository=https://github.com/skintl/cypress-file-sandbox)

This is a small app I've made, to collect various file functionalities for [Cypress](https://www.cypress.io/).

Main goal is to perform snapshot test of text file downloaded (for instance: exported csv, checksum or any secret ), and also to upload the file to `input[type="file"]`

The app contains:

- A download link for the text file (generated during build) which starts download after 5 sec in separate tab
- A file input, which additionally measures length of two files (uploaded and downloaded) and displays it on the screen

Cypress test is located under `cypress/integration`. During run, it:
1. starts to download the file
2. waits for new file in `cypress/downloads` to complete
3. compares (serverside) file contents to the snapshot located under `cypress/fixtures`
4. uploads the file to `input[type="file"]` and checks if (clientside) comparison is correct
4. if test passes it lets build to continue

## Caveats

#### Git will translate CRLF snapshot to LF during commit
this will make Cypress to detect the difference and produce confusion during debugging (`\r\n` instead of `\n`),

SOLUTION: run `git config --global core.autocrlf false` before committing (only) snapshot, and `git config --global core.autocrlf true` right after commit

#### Locally, waiting for file to download assumes the filename will be different
here it's always `secret` so filesystem will not detect new file if you have run it before and have `secret` already.
It can give you an error during deployment because `cypress/downloads` does not exist.

SOLUTION: keep something in `cypress/downloads` and clear it before running tests locally

## Installation

1. Clone the repo locally
2. Run `yarn` to install the dependencies

## Running Cypress Locally

- Run `yarn o:test` to clean `cypress/downloads`, generate secret, run server and open Cypress' UI.

## Running Cypress during build or deployment

- Run `yarn build` run the test and then publish only `public` dir
