<script>
  import NavSection from "./NavSection.svelte";
  import { makeReadableName } from "../helpers/makeReadableNameFromPath.js";

  let {
    title = null,
    folder = "",
    links = [],
    hasLightBgColor = true,
    currentPath = "/",
    nav,
  } = $props();

  const bgColor = hasLightBgColor
    ? "var(--second-darkest-hue)"
    : "var(--darkest-hue)";

  const trimmedPath = currentPath.endsWith("/")
    ? currentPath.slice(0, -1)
    : currentPath;
  const urlSegments = trimmedPath.split("/");
  const lastPathSection = urlSegments[urlSegments.length - 1];

  if (title === null && folder) {
    title = makeReadableName(folder).toUpperCase();
  }
</script>

<style>
  div {
    width: 100%;
    --menu-transition-duration: 0.3s;
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
    transition: transform var(--menu-transition-duration);
  }

  /* Animating to height: auto isn't possible, so the open/close is driven by
     a single-row grid going from 0fr to 1fr, which can transition. */
  button + div {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows var(--menu-transition-duration);
  }

  button + div > :global(*) {
    min-height: 0;
  }

  button + div.isOpenedChildren {
    grid-template-rows: 1fr;
    margin-left: -1.5rem;
  }

  button.open::after {
    transform: rotate(90deg);
  }
</style>

<div
  style={`background-color: ${bgColor}`}>

  {#if title}
    <strong>{title}</strong>
  {/if}

  <ul>
    {#each links as link}
      <!-- { path: 'about-uncle-jack',
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
          aria-pressed={nav.openedSectionPath === link.path}
          aria-expanded={nav.openedSectionPath === link.path}
          class:open={nav.openedSectionPath === link.path}
          onclick={() => {
            nav.openedSectionPath =
              nav.openedSectionPath === link.path ? '' : link.path;
          }}>
            {link.name}
          </button>

          <!-- The wrapper div must be a literal sibling of the button so the
               scoped `button + div` collapse rules aren't pruned as unused. -->
          <div class:isOpenedChildren={nav.openedSectionPath.startsWith(link.path)}>
            <NavSection
              links={link.children}
              hasLightBgColor={!hasLightBgColor}
              {currentPath}
              {nav} />
          </div>

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
