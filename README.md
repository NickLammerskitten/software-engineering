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

Die App braucht Zugangsdaten um auf Supabase zugreifen zu können. Diese werden bei Vercel über die Web-Konsole konfiguriert und dann automatisch in die Umgebungsvariablen der App geschrieben. So müssen die sensiblen Zugangsdaten nicht in das Repository committet werden. Lokal sind die Zugangsdaten dementsprechend jedoch nicht verfügbar. Stattdessen wird eine `.env`-Datei im root Verzeichnis des Projekts angelegt. Diese wird, durch den Eintrag in der `.gitignore`, automatisch von git ignoriert und hat folgenden Aufbau:
```sh
# .env
NEXT_PUBLIC_SUPABASE_URL=<supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
```
Die Werte der beiden Variablen müssen beim initialen Setup des Projekts aus der Supabase Web-Konsole kopiert und dann in der `.env`-Datei an der entsprechenden Stelle eingefügt werden.

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

First, install all required packages with
```bash
npm install
```
then run the development server:

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
