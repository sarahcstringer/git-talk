# Talk resources

Commands, configs, and bonus picks from ["The Git Commands I Avoided for 9 Years"](https://www.writethedocs.org/conf/portland/2026/speakers/#speaker-sarah-deaton-the-git-commands-i-avoided-for-9-years-and-why-i-wish-i-hadn-t-sarah-deaton) at Write the Docs Portland 2026.

## The three from the talk

### `git worktree`: a second branch without losing your place

Check out another branch in a separate folder without touching the one you're in. Same repo, same `.git`, your in-progress work undisturbed.

```bash
# new worktree, new branch, off main
git worktree add ../ga -b emphasize-ga main

# list them
git worktree list

# remove (deletes the folder; commits stay safe in .git)
git worktree remove ../ga
```

Use it any time you'd otherwise stash, switch branches, come back, and pop. Reviewing a PR while you have uncommitted work, jumping to a hotfix mid-feature, or running parallel coding sessions (Claude Code or otherwise) on the same repo.

> A given branch can only be checked out in one worktree at a time. Git refuses double-checkout, and that's a feature, not a bug.

Shipped Git 2.5, July 2015.

### `git reflog`: the trail HEAD left

Every move HEAD makes is logged: `reset`, `rebase`, `amend`, branch switches, checkouts. Default retention is 90 days.

```bash
git reflog                    # everywhere HEAD has been
git reset --hard HEAD@{2}     # rewind to two moves ago
```

> **Tip:** Commit often. Reflog only saves committed work, since uncommitted edits aren't in the object store yet. Ugly WIPs are the price of admission to the safety net.

### `git rebase --update-refs`: rebase a stack in one shot

When you have stacked branches (B on A, C on B), rebasing A used to mean manually rebasing B and C too, and resolving the same conflicts each time. `--update-refs` walks the whole stack and moves every branch ref as it goes.

```bash
# from the tip of the stack
git rebase --update-refs main
```

Make it the default:

```bash
git config --global rebase.updateRefs true
```

Shipped Git 2.38, October 2022.

---

## My daily commands

The handful that actually get typed in a day:

```bash
git status
git add -p                 # stage hunks interactively, way better than `add .`
git commit -m "..."
git rebase -i HEAD~5       # tidy commits before pushing
git push
```

Plus:

```bash
git switch -                   # toggle to previous branch, like `cd -`
git diff --staged              # what you're about to commit
git log --oneline -20          # quick scan
git commit --amend --no-edit   # tack the staged change onto the last commit
```

---

## Other things worth knowing

These didn't fit in the talk but are too useful to leave out.

### `git log -S`: the pickaxe

The pickaxe finds commits that change the count of a string. Useful for tracking when a sentence got added or removed.

```bash
git log -S "deprecated" -- docs/
git log -S "old function name" --pretty=format:"%h %ad %s" --date=short
```

Use `-G "regex"` for regex matching instead of literal strings. An archaeology tool for docs people. Shipped 2006.

### `rerere`: reuse recorded resolution

Git remembers how you resolved a conflict, and next time the same conflict shows up, it auto-applies the fix.

```bash
git config --global rerere.enabled true
```

Free to turn on. Pairs well with `--update-refs`, since some conflicts still resurface across stack rebases. Shipped 2006.

### `rebase.autoStash`: stash before rebase, pop after

Auto-stashes uncommitted changes before a rebase and pops them after. The quieter fix for "you have unstaged changes" interrupting your flow.

```bash
git config --global rebase.autoStash true
```

Shipped 2013.

### `--force-with-lease`: the polite force push

Force push that refuses if someone else pushed first. Saves you from silently clobbering a teammate's commits.

```bash
git push --force-with-lease
```

A useful alias:

```bash
git config --global alias.pushf "push --force-with-lease"
```

Shipped 2013.

### `git switch` / `git restore`

`git checkout` did two unrelated jobs (move HEAD vs. revert files). 2019 split them into clearer commands.

```bash
# switch branches
git switch main
git switch -c new-branch    # create and switch
git switch -                # last branch

# restore files
git restore file.md                    # discard local edits
git restore --staged file.md           # un-stage
git restore --source HEAD~3 file.md    # pull a file from three commits ago
```

`checkout` still works, but the new ones are easier to teach.

### `git blame -L`: line-range blame

Blame a specific line range. Add `-w` to ignore whitespace-only changes, which is huge for prose with reformatting.

```bash
git blame -L 10,20 -w -- docs/quickstart.md
```

### `git bisect`: binary search through history

Find the commit that broke something. Mark a known-good and a known-bad commit; git checks out midpoints and asks. Cuts a thousand commits down to ten checks.

```bash
git bisect start
git bisect bad                  # current commit is broken
git bisect good v2.0            # this tag was fine
# git checks out a midpoint; test, then:
git bisect good   # or: git bisect bad
git bisect reset                # done
```

### `jj`: Jujutsu

A different VCS that works against git repos. It rethinks the model: no staging area, every change is a snapshot, and conflicts become first-class objects you can carry around and resolve later. Not a recommendation to switch, just a reminder that git isn't settled law.

- [Jujutsu on GitHub](https://github.com/jj-vcs/jj): source, install instructions, model docs
- [Jujutsu tutorial](https://martinvonz.github.io/jj/latest/tutorial/): walk through the model and daily commands

---

## One last thing

If a part of your workflow has been annoying for so long you stopped noticing (the stash dance, the PR you abandoned because rebasing was too painful, the fourth time resolving the same conflict), go look. There's probably already a flag for it.
