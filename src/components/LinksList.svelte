<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { makeReadableName } from '../helpers/makeReadableNameFromPath';

  export let isNav = false,
    folder = null,
    title = null,
    className = null,
    links = [];

  const { page } = stores();
  const currentPath = $page.path;
  const trimmedPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  const removedSlashes = trimmedPath.split('/');
  const lastPathSection = removedSlashes[removedSlashes.length - 1];
  if (title === null) {
    title = folder
      ? makeReadableName(folder).toUpperCase()
      : makeReadableName(lastPathSection);
  }

  const fetchPath = folder ? folder : trimmedPath;

  if (links.length === 0) {
    onMount(() =>
      fetch(fetchPath + '.json')
        .then((res) => res.json())
        .then((json) => (links = json))
        .catch((err) => console.log(`error in fetch from ${fetchPath}.json`))
    );
  }
</script>

<div class="{folder} {className}">
  <h2 style="{isNav ? 'font-size: 24px;' : null}">
    {#if isNav}
    <a rel="prefetch" href="/{folder ? folder : ''}">{title}</a>
    {:else if title} {title} {/if}
  </h2>
  <ul>
    {#each links as link}
    <li><a rel="prefetch" href="{link.path}">{link.name}</a></li>
    {/each}
  </ul>
</div>

<style>
  div {
    background-color: white;
    margin-bottom: 1rem;
  }

  .home,
  .featured-topics {
    background-color: goldenrod;
    color: white;
  }

  .home {
    border: 2px solid black;
  }

  .featured-topics {
    border: 2px solid royalblue;
  }

  .categories {
    background-color: darkred;
    color: white;
    border: 2px solid lightgray;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 0.5rem;
  }

  a {
    text-decoration: none;
    display: block;
  }

  a:visited {
    color: black;
  }
  a:hover,
  a:active {
    color: green;
  }
</style>
