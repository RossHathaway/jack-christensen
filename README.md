# Jack Christensen

Based on the default [Sapper](https://github.com/sveltejs/sapper)#Rollup template.

## Structure

 - .md files in src/routes are processed by the svelte-preprocess-markdown library to make *.svelte files. 
 - Folders within routes/ each have an index.svelte page that uses the Links component from src/components to list the other files in the same folder.
 - The data passed to the Links component when the site is being built is from the index.json.js file in the same folder which makes a server endpoint for when sapper is doing the build. This gets the filenames and routes for the other files in the parent folder.


## Production mode and deployment

To start a production version of this app, run `npm run export && npm start`. This is because it is a static app and uses the sapper export command instead of the sapper build command. Running in production will disable live reloading, and activate the appropriate bundler plugins.

You can deploy your application to any environment that supports Node 8 or above. 

