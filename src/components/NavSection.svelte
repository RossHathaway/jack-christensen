<script>
  import { stores } from "@sapper/app";
  import { makeReadableName } from "helpers/makeReadableNameFromPath";
  import { splitUrlOnSlash } from "helpers/splitUrlOnSlash";

  export let title = null,
    folder = "",
    links = [],
    hasLightBgColor = true;

  const bgColor = hasLightBgColor
    ? "var(--second-darkest-hue)"
    : "var(--darkest-hue)";

  const { page } = stores();
  $: trimmedPath = $page.path.endsWith("/")
    ? $page.path.slice(0, -1)
    : $page.path;
  $: urlSegments = trimmedPath.split("/");
  let lastPathSection = "";
  $: lastPathSection = urlSegments[urlSegments.length - 1];

  if (title === null) {
    title = folder
      ? makeReadableName(folder).toUpperCase()
      : makeReadableName(lastPathSection);
  }
</script>

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

  button {
    background-color: inherit;
    color: white;
    width: 100%;
    text-align: left;
  }

  button::after {
    content: "";
    height: 1.1em;
    width: 1.1em;
    background-image: url("/logos/triangle-isoceles-optimized.svg");
    background-repeat: no-repeat;
    background-position: center;
    float: right;
    transform: rotate(180deg);
  }
  /* button {
    min-height: 1rem;
    min-width: 1rem;


    transition: transform 0.3s;
    display: inline-block;
    outline: none;
  } */

  /*

  input[type="checkbox"]:checked {
    transform: rotate(90deg);
  }

  input[type="checkbox"] ~ div {
    height: 0;
    overflow: hidden;
  }

  input[type="checkbox"]:checked ~ div {
    height: auto;
  } */
</style>

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
          <!-- <input type="checkbox" name={link.name} id={link.name} />
          <label for={link.name}>{link.name}</label>
           -->
          <button aria-pressed="false" aria-expanded="false">
            <!-- on:click={() => set store for currentLink to link.path -->
            {link.name}
          </button>

          <svelte:self
            links={link.children}
            hasLightBgColor={!hasLightBgColor} />
        {:else}
          <a
            href={link.path}
            aria-current={urlSegments.includes(link.lastUrlSegment) ? 'location' : undefined}>
            {link.name}
          </a>
        {/if}
      </li>
    {/each}
  </ul>

</div>
