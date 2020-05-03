<script>
  import { stores } from '@sapper/app';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';
  import { splitUrlOnSlash } from 'helpers/splitUrlOnSlash'

  export let isNav = false,
    folder = '',
    title = null,
    links = [];

  const { page } = stores();
  $: trimmedPath = $page.path.endsWith('/') ? $page.path.slice(0, -1) : $page.path;
  $: urlSegments = trimmedPath.split('/');
  $: lastPathSection = urlSegments[urlSegments.length - 1];

  if (title === null) {
    title = folder
      ? makeReadableName(folder).toUpperCase()
      : makeReadableName(lastPathSection);
  }

</script>
<div class="{folder}">
  <h2>
    {#if isNav}
    <a rel="prefetch" 
      href="/{folder}" 
      aria-current={lastPathSection === folder ? "location" : undefined}>
      {title}
    </a>
    {:else if title} {title} {/if}
  </h2>
  <ul>
    {#each links as link}
    <li>
      <a rel="prefetch" 
        href="{link.path}" 
        aria-current={urlSegments.includes(link.lastUrlSegment) ? "location" : undefined}
        >
          {link.name}
        </a>
      </li>
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
