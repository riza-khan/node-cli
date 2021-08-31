# Node CLI

I'll admit this is a bit overkill. This CLI maintains a database of your git branches along with some meta data.

This had come out for a need to add some information to the description of a git commit. This repo was the answer to automate that process.

## Installation

`npm install`

You will have to link it to your system so you can use the `db` comment:
`sudo npm link`

## Why use this?

Although it is overkill, there are advantages and it can be expanded endlessly.

1. You can retrieve meta data from the tables you create. Specfically, I used it to retrieve time it took to complete a bug or feature.
2. Practice Node JS
3. Have a deeper understanding of git hooks
4. Have a deeper understanding of MYSQL (or any relational database), because you can now added tables that use common data and create complex unions and calculations.
