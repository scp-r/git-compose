# git-compose
git-compose rebase the code on multiple branches into a new branch (instead of using merge).
It finds the common ancestor commit of all input branches, and create target branch on this commit. For each input branch, git-compose branch out a new temporary branch and rebase this temporary branch onto the target branch.

## Installation

git-compose requires Node.js >= 16 and [zx](https://github.com/google/zx). After installing Node.js, run:

```
npm instal -g zx
```

to install zx globally. Then download [git-compose.mjs](https://github.com/scp-r/git-compose/blob/main/git-compose.mjs) from this repo, put it in a fixed location, and execute
```
git config --global alias.compose '!zx /path/to/git-compose.mjs'
```

## Usage

```
git compose -o <output-branch-name> <source-branch-1> <source-branch-2> ...
```

## About empty commit

git-compose adds an empty commit to the ancestor commit of all input branches. This avoids putting the output branch onto an input branch and makes your commit tree cleaner.
