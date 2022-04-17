<script>
  import { stores } from "@sapper/app";
  import { openedSectionPath } from "./openedSectionPathStore.js";
  import { makeReadableName } from "helpers/makeReadableNameFromPath";
  import { splitUrlOnSlash } from "helpers/splitUrlOnSlash";

  export let title = null,
    folder = "",
    links = [],
    hasLightBgColor = true,
    isOpenedChildren = false;

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
    text-indent: -1.5rem;
    padding-left: 1.75rem;
  }

  span.empty {
    color: var(--alt-bg-color-1);
    size: 0.8em;
  }

  button {
    background-color: inherit;
    color: white;
    width: 100%;
    text-align: left;
    cursor: pointer;
    position: relative;
    left: -1.5rem;
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
    transition: transform 0.3s;
  }

  button + div {
    height: 0;
    overflow: hidden;
  }

  button + div.isOpenedChildren {
    height: auto;
    margin-left: -1.5rem;
  }

  button.open::after {
    transform: rotate(90deg);
  }
</style>

<div
  style={`background-color: ${bgColor}`}
  class="{isOpenedChildren ? 'isOpenedChildren' : ''}
  {$$props.class || ''}">
  <!-- class passed down from parent, or no class if none was passed -->

  <strong>{title}</strong>

  <ul>
    {#each links as link}
      <!-- { path: 'src/routes/about-uncle-jack',
    name: 'About Uncle Jack',
    lastUrlSegment: 'about-uncle-jack',
    children: [ [Object], [Object] ] } -->
      <li>
        {#if link.children && link.children.length === 0}
          <span class="empty">{link.name}</span>

        {:else if link.children && ((link.children.length === 1 && link.children[0].name === link.name))}
          <a
          href={link.children[0].path}
          aria-current={lastPathSection === link.lastUrlSegment ? 'location' : undefined}>
            {link.name}
          </a>

        {:else if link.children && link.children.length}

          <button
          aria-pressed={$openedSectionPath === link.path}
          aria-expanded={$openedSectionPath === link.path}
          class:open={$openedSectionPath === link.path}
          on:click={() => {
            openedSectionPath.update((prev) =>
              prev === link.path ? '' : link.path
            );
          }}>
            {link.name}
          </button>

          <svelte:self
            links={link.children}
            hasLightBgColor={!hasLightBgColor}
            isOpenedChildren={$openedSectionPath.startsWith(link.path)} />

        {:else}
          <a
            href={link.path}
            aria-current={lastPathSection === link.lastUrlSegment ? 'location' : undefined}>
            {link.name}
          </a>
        {/if}
      </li>
    {/each}
  </ul>

</div>
