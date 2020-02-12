<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { makeReadableName } from '../helpers/makeReadableNameFromPath';

  export let isNav = false,
    bgColor = 'white',
    borderColor = null;

  const { page } = stores();
  const currentPath = $page.path;
  const trimmedPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  const removedSlashes = trimmedPath.split('/');
  const lastPathSection = removedSlashes[removedSlashes.length - 1];
  const title = makeReadableName(lastPathSection);
  let links = [];

  onMount(() =>
    fetch(trimmedPath + '.json')
      .then((res) => res.json())
      .then((json) => (links = json))
      .catch((err) => console.log(`error in fetch from ${trimmedPath}.json`))
  );
</script>

<div>
  <h3>{isNav ? `<a href="/{lastPathSection}">${title}</a>` : title}</h3>
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

  li {
    padding: 0.5rem;
  }
</style>
