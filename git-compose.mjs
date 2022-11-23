if (process.platform === 'win32') {
  $.shell = `C:/Program Files/Git/usr/bin/bash.exe`;
}
$.verbose = false
// check if working tree is clean
let out = (await $`git diff HEAD`).stdout;
out = out.trim();
if (out.length > 0) {
  console.error(`Cannot compose: Your index contains uncommitted changes.\nPlease commit or stash them.`)
  process.exit(1)
}

// find common ancestor
const argv = process.argv.slice(3);
if (argv.length === 0) {
  process.exit(0);
}
// help
if (argv.includes('--help')) {
  console.log('Compose: rebase multiple branches into one\nUsage: git compose -o <output-branch-name> <branch>…​');
  process.exit(0);
}
// output name
const idx = argv.indexOf('-o');
if (idx === -1 || !argv[idx + 1]) {
  console.error('missing output branch name');
  process.exit(1);
}
const target = argv.splice(idx, 2)[1]

const branches = argv;

let ancester = branches[0];
for(let branch of branches.slice(1)) {
  ancester = (await $`git merge-base ${ancester} ${branch}`).stdout;
  // remove '\n'
  ancester = ancester.trim();
}
const date = new Date();
const stamp = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;

// create new branch from common ancester
await $`git branch ${target} ${ancester}`
await $`git checkout ${target}`
// create a empty commit to avoid add commits onto first branch
await $`git commit -m "empty commit" --allow-empty`

// rebase
for(let branch of argv) {
  console.log(`processing ${branch}...`)
  const tempName = `compose_temp_${branch}-${target}`
  // create new branch from current branch
  await $`git branch ${tempName} ${branch}`
  await $`git checkout ${tempName}`
  // place all commits onto target branch
  await $`git rebase ${target}`
  await $`git checkout ${target}`
  // fast forward
  await $`git merge ${tempName}`
  // cleanup
  await $`git branch -d ${tempName}`
}
