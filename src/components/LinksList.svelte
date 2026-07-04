<script>
  import { makeReadableName } from '../helpers/makeReadableNameFromPath.js';

  let {
    isNav = false,
    folder = '',
    title = null,
    links = [],
    currentPath = '/',
  } = $props();

  const trimmedPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;
  const urlSegments = trimmedPath.split('/');
  const lastPathSection = urlSegments[urlSegments.length - 1];

  if (title === null) {
    title = folder
      ? makeReadableName(folder).toUpperCase()
      : makeReadableName(lastPathSection);
  }
</script>
<div class="{folder}">
  <h2>
    {#if isNav}
    <a
      href="/{folder}"
      aria-current={lastPathSection === folder ? "location" : undefined}>
      {title}
    </a>
    {:else if title} {title} {/if}
  </h2>
  <ul>
    {#each links as link}
    <li>
      <a
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
