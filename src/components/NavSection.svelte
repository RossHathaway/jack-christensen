<script>
  import { stores } from '@sapper/app';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';
  import { splitUrlOnSlash } from 'helpers/splitUrlOnSlash'

  export let title = null,
    folder = '',
    links = [],
    hasLightBgColor = true

    const bgColor = hasLightBgColor ? 'var(--second-darkest-hue)' : 'var(--darkest-hue)'

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

<div style={`background-color: ${bgColor}`}>
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
      <input type="checkbox" name={link.name} id={link.name}/>
        <label for={link.name}>
          {link.name}
        </label>
        <svelte:self links={link.children} hasLightBgColor={!hasLightBgColor}></svelte:self>

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
  div {
    width: 100%;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
    margin: 0;
    padding-inline-start: 0;
  }

  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.25rem;
  }

  label {
    min-width: calc(100% - 2rem);
  }

  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    min-height: 1rem;
    min-width: 1rem;

    background-image: url('/triangle-isoceles-optimized.svg');
    background-repeat: no-repeat;
    background-position: center;

    transition: transform .3s;
    display: inline-block;
    outline: none;
  }

  input[type="checkbox"]:checked {
    transform: rotate(90deg);
  }

  input[type="checkbox"] ~ div {
    height: 0;
    overflow: hidden;
  }

  input[type="checkbox"]:checked ~ div {
    height: auto;

  }

</style>