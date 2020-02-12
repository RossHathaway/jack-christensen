<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { makeReadableName } from '../helpers/makeReadableNameFromPath';

  const { page } = stores();
  const currentPath = $page.path;
  const trimmedPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  const removedSlashes = trimmedPath.split('/');
  const title = makeReadableName(removedSlashes[removedSlashes.length - 1]);
  let links = [];

  onMount(() =>
    fetch(trimmedPath + '.json')
      .then((res) => res.json())
      .then((json) => (links = json))
      .catch((err) => console.log(`error in fetch from ${trimmedPath}.json`))
  );
</script>

<div>
  <h3>{title}</h3>
  <ul>
    {#each links as link}
    <li><a href="{link.path}">{link.name}</a></li>
    {/each}
  </ul>
</div>

<style>
  ul {
    list-style: none;
  }
</style>
