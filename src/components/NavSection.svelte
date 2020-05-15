<script>
  import { stores } from '@sapper/app';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';
  import { splitUrlOnSlash } from 'helpers/splitUrlOnSlash'

  export let title = null,
    folder = '',
    links = [],
    bgColor = 'var(--second-darkest-hue)'

  const { page } = stores();
  $: trimmedPath = $page.path.endsWith('/') ? $page.path.slice(0, -1) : $page.path;
  $: urlSegments = trimmedPath.split('/');
  let lastPathSection = ''
  $: lastPathSection = urlSegments[urlSegments.length - 1];

  if (title === null) {
    title = folder
      ? makeReadableName(folder).toUpperCase()
      : makeReadableName(lastPathSection);
  }


</script>

<div>
<strong>{title}</strong>
<!-- aria-current={lastPathSection === folder ? "location" : undefined} -->
<ul>
  {#each links as link}
    <!-- { path: 'src/routes/about-uncle-jack',
    name: 'About Uncle Jack',
    lastUrlSegment: 'about-uncle-jack',
    children: [ [Object], [Object] ] } -->
    <li>
      {#if link.children}
        <label>
          <input type="checkbox" />
          {link.name}
        </label>
        <svelte:self links={link.children}></svelte:self>

      {:else}
        <a href={link.path} aria-current={urlSegments.includes(link.lastUrlSegment) ? "location" : undefined}>
          {link.name}
        </a>
      {/if}
    </li>

  {/each}
</ul>

</div>

<style>

  ul {
    list-style: none;
    border: 3px solid black;
  }

  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  /* opacity: 0;
  z-index: 1; */
  }

  input[type="checkbox"]:checked:before {
  /* NOTE: Replace the url with a path to an SVG of a checkmark to get a checkmark icon */
  background-image: url('triangle-isoceles-optimized.svg');
  background-repeat: no-repeat;
  background-position: center;
  /* The size of the checkmark icon, you may/may not need this */
  /* background-size: 25px;
  border-radius: 2px;
  background-color: #e7ffba;
  color: white; */
  }

  input[type="checkbox"]:checked {
    transform: rotate(90deg);
  }

</style>