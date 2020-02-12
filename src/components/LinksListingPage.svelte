<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';

  const { page } = stores();
  const currentPath = $page.path;
  const trimmedPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  let links = [];

  onMount(() =>
    fetch(trimmedPath + '.json')
      .then((res) => res.json())
      .then((json) => (links = json))
      .catch((err) => console.log(`error in fetch from ${trimmedPath}.json`))
  );
</script>

<ul>
  {#each links as link}
  <li><a href="{link.path}">{link.name}</a></li>
  {/each}
</ul>
