# Bunicorn Launchpad Admin Page 

## Environment
```
Node version: v14.20.0
```


## Setup with docker

#### Step 1
Create ``.env`` file
```
cp .env.dev.example .env
```

#### Step 2
```
npm run docker-init
```

#### Step 3: Run development server
```
npm run docker-start
```

#### Step 4

Access:
```
http://localhost:8666/#/
```

Enjoy and Finish !!!


## Install new npm-package
#### Step 1
Access to docker-container
```
npm run docker-connect
```

#### Step 2
```
npm install [package-name]
```

## Project Convention
#### Coding convention
Check coding convention with physic machine
```
make eslint
```
or
```
npm run lint && npm run format
```
Check coding convention with docker
```
npm run docker-eslint
```
### Branch name convention
Format general: ``type/subject``

Type  | Explain
------------- | -------------
feature  | The `feature` branch is a branch to implement a new feature/function.
fix | The `fix` branch is a branch fix bug.
hotfix |  The `hotfix` branch is a branch hotfix bug in the production environment.
release | The `release` branch is a branch release following deadline delivery. The release branch gets merged into master branch and tagged with a version number

Example: 
- branch to fix bug (has ticket): `fix/TBL-838`

### Commit convention
Format general: ``type(scope?): subject``

Type  | Explain
------------- | -------------
build  | The `build` type for changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
chore | The `chore` type for other changes that don't modify src or test files
ci | The `ci` type for changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
docs | The `docs` type for documentation only changes.
feat | The `feat` type is the a new feature.
fix | The `fix` type is the a bug fix.
perf | The `perf` type for change that improves performance.
refactor | The `refactor` type for change that neither fixes a bug nor adds a feature.
revert | The `revert` type for reverts a previous commit
style | The `style` type for changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
test | The `test` type for adding missing tests or correcting existing tests.


### Pull request convention
When you create a pull request, you need to add a comment follow the pull request template and update the checklist
