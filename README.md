# Jack Christensen

Based on the default [Sapper](https://github.com/sveltejs/sapper)#Rollup template.

## Structure

 - .md files in src/routes are processed by the svelte-preprocess-markdown library to make *.svelte files. 
 - Folders within routes/ each have an index.svelte page that uses the Links component from src/components to list the other files in the same folder.
 - The data passed to the Links component when the site is being built is from the index.json.js file in the same folder which makes a server endpoint for when sapper is doing the build. This gets the filenames and routes for the other files in the parent folder.

All server-side code will be run during build to produce a static site and will not run in production, which is why I use readdirSync instead of async and do not need to cache the files.

## Production mode and deployment

To start a production version of this app, run `npm run export`. This will make a static version of the app. There is no need to run `npm start` or similar commands after when deploying on Now v2. The default folder this will export to is `__sapper__/export`.

You can deploy your application to any environment that supports Node 8 or above. 

