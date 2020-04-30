<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';

  export let isNav = false,
    lastPathSection = null,
    folder = null,
    title = null,
    className = null,
    links = [];

  if (title === null) {
    title = folder
      ? makeReadableName(folder).toUpperCase()
      : makeReadableName(lastPathSection);
  }

</script>
<!-- {className} -->
<div class="{folder}">
  <h2>
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
    margin-bottom: 1rem;
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

  /* a:hover,
  a:active {
    color: green;
  } */
</style>
