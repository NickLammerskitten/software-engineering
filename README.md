## EinfachKunst

Software Engineering I Projekt

## Development

<div align="center">
  
![branches (1)](https://github.com/user-attachments/assets/4f35f75d-6c7d-474c-9061-97d7ef913fa9)
  
</div>

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
**PROD**: Die Werte der beiden Variablen müssen beim initialen Setup des Projekts aus der Supabase Web-Konsole kopiert und dann in der `.env`-Datei an der entsprechenden Stelle eingefügt werden.

**DEV**: Die Werte werden aus der Konsole kopiert, wenn der `npx supabase start` Befehl ausgeführt wurde. So wird die lokale supabase Instanz verwendet.

### Local Supabase Setup

Supabase ist ein Teil des lokalen Setups. Die Vorgehensweise ist dabei relevant. 

#### [Supabase Setup](https://supabase.com/docs/guides/local-development)

Installation der Supabase CLI (wenn nicht schon durch `npm i` installiert):
```bash
npm install supabase --save-dev
```

Der `npx supabase init` command wurde bereits durchgeführt in dem Repository.

Führe diesen Befehl in dem Projektordner um die Datenbank zum ersten Mal einzurichten:

```bash
# (falls noch nicht angemeldet)
npx supabase login

npx supabase link
npx supabase db pull
npx supabase start
```

#### [Supabase Migration](https://supabase.com/docs/guides/local-development/overview)

```bash
npx supabase migration new create_employees_table
```

Wird eine Änderung durchgeführt, muss eine Migrationsdatei angelegt werden und die Änderungen dort formuliert werden.
Um ein sauberes DB Seeding weiter gewährleisten zu können, muss die seed.sql ebenfalls angepasst werden.

Überprüfung der gemachten Änderungen. Dies gibt die Differenz des Db Schemas aus, zwischen Produktiv und Lokal:

```bash
npx supabase db diff
```

Die Ausgabe des oben genannten Befehls kann ebenso genutzt werden, um die Migration File auszufüllen.

Ist die Migration-File fertig und funktionsfähig, so kann weiter mithilfe von Git gearbeitet werden, indem die Datei gepushed wird im Feature-Branch.

Wichtig: führe niemals subabase db Push aus. Das führt zu einem Produktiven Deployment, was laut unseren CI/CD Vorschriften strengstens verboten ist aus einem feature Branch heraus. Dieser Befehl wird erst im Produktiven Deployment auf den main Branch durchgeführt!

#### [Supabase Seeding](https://supabase.com/docs/guides/local-development/seeding-your-database)

Seeding erfolgt über den Inhalt in der `supabase/seed.sql` Datei. Beim Ausführen von `npx supabase start` oder 
`npx supabase db reset` wird der gesamte Inhalt der Seeding-Datei auf die lokale Datenbank angewandt. 

Um die Seeding-Datei zu erweitern, müssen nur weitere SQL Statements angefügt werden.

## Release Management
Für das Release Management werden [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) verwendet. So ist eine gute Organisation der Standard und Changelogs können einfach generiert werden.
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

## Release einer Version
Der Release einer neuen Version von EinfachKunst erfolgt ganz einfach mit [release-it](https://github.com/release-it/release-it).
```bash
npm run release
```
Es folgt eine interaktive Führung durch den Release, wobei jede der Abfragen angenommen werden sollte. Also einfach jedes Mal Enter drücken.
```bash
? Commit (Release 0.2.0)? <Enter oder Y>
? Tag (0.2.0)? <Enter oder Y>
? Push? <Enter oder Y>
? Create a release on GitHub (Release 0.2.0)? <Enter oder Y>
```
**Wichtig**: Releases werden nur vom aktuellen Stand im `main`-Branch erstellt!

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
