# Visual regression testing

Screenshots every page of the built site with Playwright and diffs a branch
against a base branch with pixelmatch. CI runs this on every pull request via
`.github/workflows/visual-regression.yml` on GitHub-hosted runners and posts
the summary to the PR.

## Running locally

```sh
# 1. Build and capture the branch you're on
npm run build
npm run vr:capture -- --out visual-regression/shots/head

# 2. Build and capture the base branch (worktree keeps your checkout intact)
git worktree add /tmp/vr-base master
(cd /tmp/vr-base && npm ci && npm run build)
npm run vr:capture -- --dist /tmp/vr-base/dist --out visual-regression/shots/base
git worktree remove /tmp/vr-base

# 3. Compare and print the summary
npm run vr:compare -- \
  --base visual-regression/shots/base \
  --head visual-regression/shots/head \
  --out visual-regression/report \
  --base-label master --head-label my-branch
```

The report lands in `visual-regression/report/`: `summary.md`, `summary.json`,
and a `diffs/` folder with a highlight image per changed page.

If Playwright's managed Chromium isn't installed (`npx playwright install
chromium`), point the capture script at any Chromium binary with
`CHROMIUM_PATH=/path/to/chrome`.

Options: `--width` sets the viewport width (default 1280);
`--threshold` sets pixelmatch sensitivity (default 0.1);
`--fail-on-diff` makes compare exit non-zero when pages changed.
