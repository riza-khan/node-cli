# Git Database

I'll admit this is a bit overkill. This Node based CLI maintains a database of your git branches along with some meta data.

This had come out for a need to add some information to the description of a git commit. This repo was the answer to automate that process.

## Installation

`npm install`

You will have to link it to your system so you can use the `db` comment:
`sudo npm link`

### Database

You will need a database in order to use this repo. Adjust `index.js` file accordingly with your database's information.
You will need to create the database and create a table (called `git`) with the following columns:

| Column Name | DataType     | Key    | Default           | Extra                                         |
| ----------- | ------------ | ------ | ----------------- | --------------------------------------------- |
| branch      | varchar(255) | UNIQUE |                   |                                               |
| jira_link   | varchar(255) |        |                   |                                               |
| type        | varchar(255) |        |                   |                                               |
| active      | tinyint      |        |                   |                                               |
| created_at  | timestamp    |        | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at  | timestamp    |        | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

## Why use this?

Although it is overkill, there are advantages and it can be expanded endlessly.

1. You can retrieve meta data from the tables you create. Specfically, I used it to retrieve time it took to complete a bug or feature.
2. Practice Node JS
3. Have a deeper understanding of git hooks
4. Have a deeper understanding of MYSQL (or any relational database), because you can now added tables that use common data and create complex unions and calculations.

## Tutorial

Using this program is quite simple. **All** commands are prefixed with the letters `db`.

Followed by the following available methods and params.

1. `all` - No params
2. `create` - required params: `branch`, `jira_link`, `type`, optional param: `active` which defaults to 1 when you create the branch.
3. `toggle` - required params: `branch`
4. `time` - required params: `branch`

## Git Hooks Code

The git hooks code is also important to make this work (though not really required):

### `pre-commit`:

```
#!/usr/bin/env node

const { execSync } = require("child_process");
execSync("prettier --write . && git add -A .");
process.exit(0);

```

### `prepare-commit-msg`:

```
#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

const [default1, default2, msgFile] = process.argv;

const setupMessageFile = async (file) => {
  try {
    const gitBranch = await execSync("git branch --show-current", {
      encoding: "utf-8",
    });

    const meta = await execSync(`db find ${gitBranch}`, {
      encoding: "utf-8",
    });

    fs.writeFileSync(file, "\n\n");
    fs.appendFileSync(file, `Branch: ${gitBranch}`);
    fs.appendFileSync(file, `${meta}`);
    return process.exit(0);
  } catch (e) {
    console.log(`An error occured: ${e}`);
    return process.exit(1);
  }
};

setupMessageFile(msgFile);

```

### `post-commit`

In order to use this be sure to set you permissions like so: `chmod +x .git/hooks/post-commit`

```
#!/usr/bin/env node

let { execSync } = require("child_process");

async function saveCommitHash() {
	try {
		const hash = await execSync("git rev-parse --verify HEAD", {
			encoding: "utf-8",
		});

		const gitBranch = await execSync("git branch --show-current", {
			encoding: "utf-8",
		});

		const hashSaved = await execSync(`db hash '${gitBranch}' ${hash}`, {
			encoding: "utf-8",
		});
		return process.exit(0);
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

saveCommitHash();

```
