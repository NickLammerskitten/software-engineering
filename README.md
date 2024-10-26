## EinfachKunst

Software Engineering I Projekt

## Development

Es gibt drei branches im Projekt, die immer vorhanden sind:
- `main`
- `deployment`
- `development`

Der `main`-branch ist immer der aktuelle Produktivstand.

Der `deployment`-branch fungiert als Zwischenstage zum `main`-branch. Fertige Entwicklungsstände werden hier rein gemerged und in angemessenen Abständen in den `main`-branch zur Veröffentlichung gemerged. Jeder merge in `main`, bzw. jeder Release, soll in einem Release auf GitHub resultieren. Wie ein Release aussehen soll steht näher beschrieben unter [Release Management](##-release-management).

Der `development`-branch ist der Entwicklungsbranch. Neue Featurebranches werden von hier ausgecheckt und später wieder nach hier gemerged. Stabile Stände können in den `deployment`-branch gemerged werden.

Featurebranches werden immer vom `development`-branch ausgecheckt und sollten möglichst ein Issue referenzieren (durch Conventional Commits). Sie werden, wenn das Feature fertig ist, mit einer PR wieder in den `development`-branch gemerged. Diese PR muss von mind. einer anderen Person reviewed werden.

## Release Management
Für das Release Management werden [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) verwendet. So ist eine gute Organisation der Standart und Changelogs können einfach generiert werden.
Ein Beispielhafter Commit sieht folgendermaßen aus:
```
git commit -m "feat(#12): added this new feature"
```
In den Klammern sollte immer, falls vorhanden, das entsprechende Issue referenziert werden. Diese werden dann praktischerweise in GitHub zu Links zu den entsprechenden Issues. Sollte es kein Issue zu dem Commit geben, kann (muss aber nicht) in die Klammern der Scope des Commits geschrieben werden, also z.B. "backend", "login" oder "documentation".

Neue branches werden mit einem [ähnlichen Schema](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4) benannt:
```
git branch feat/#12/add-this-new-feature"
```

Branches mit mehreren Commits sollten immer mit "Squash Commits" gemerged werden. Dabei wird der PR Name als Commit Message genommen. Der Name der PR sollte daher auch den Conventional Commits folgen.

PRs, die noch nicht gemerged oder reviewed werden sollen, müssen mit dem "Draft: " previx im Titel gekennzeichnet werden. Außerdem sollten logischerweise noch keine Reviews angefordert werden.

Reviews werden immer vom PR-Ersteller angefordert. Man weist sich nicht selber als Reviewer zu.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
