<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { makeReadableName } from '../helpers/makeReadableNameFromPath';

  export let isNav = false,
    folder = null,
    classForStyling = 'index';

  const { page } = stores();
  const currentPath = $page.path;
  const trimmedPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  const removedSlashes = trimmedPath.split('/');
  const lastPathSection = removedSlashes[removedSlashes.length - 1];
  const title = folder
    ? makeReadableName(folder)
    : makeReadableName(lastPathSection);

  const fetchPath = folder ? folder : trimmedPath;

  let links = [];

  onMount(() =>
    fetch(fetchPath + '.json')
      .then((res) => res.json())
      .then((json) => (links = json))
      .catch((err) => console.log(`error in fetch from ${fetchPath}.json`))
  );
</script>

<div>
  <h3>
    {#if isNav}
    <a rel="prefetch" href="/{folder}">{title}</a>
    {:else} {title} {/if}
  </h3>
  <ul>
    {#each links as link}
    <li><a rel="prefetch" href="{link.path}">{link.name}</a></li>
    {/each}
  </ul>
</div>

<style>
  div {
    background-color: var(--bgColor, white);
    border: var(--border, none);
  }

  ul {
    list-style: none;
  }

  li {
    padding: 0.5rem;
  }

  a:visited {
    color: var(--visitedColor, green);
  }
  a:hover,
  a:active {
    color: var(--activeColor, red);
  }
</style>
