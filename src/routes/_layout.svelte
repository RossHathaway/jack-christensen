<script context="module">
  export async function preload() {
    let links = this.fetch("navLinks.json")
      .then((res) => res.json())
      .catch((e) => console.log("error fetching links in Nav", e));

    links = await links;

    return { links };
  }
</script>

<script>
  import CircleSquareLogoButton from "../components/CircleSquareLogoButton.svelte";
  import Nav from "../components/Nav.svelte";
  import Title from "../components/Title.svelte";

  export let links;
</script>

<style>
  #main-container {
    display: grid;
    grid-template-columns: 20rem auto 1fr;
    justify-items: center;
    min-width: 0;
    /* scroll ? */
  }

  #main-container > :global(header) {
    grid-column-start: 2;
    grid-column-end: 4;
  }

  :global(#nav-container) {
    grid-column-start: 1;
    grid-row-start: 2;
  }

  #observe-resize {
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 2;

    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }

  @media screen and (max-width: 1000px) {
    #main-container {
      grid-template-columns: 80px auto 80px;
    }

    #observe-resize {
      grid-column-start: 1;
      grid-column-end: 4;
    }

    :global(#nav-container) {
      grid-column-start: 3;
      grid-row-start: 1;
    }

    #main-container > :global(header) {
      grid-column-end: 3;
    }

    :global(#logo > svg) {
      min-width: 90px;
      max-width: 90px;
    }
  }
</style>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Gelasio|Galindo|Noto+Serif&display=swap"
    rel="stylesheet" />
  <title>Jack Shields Christensen</title>
</svelte:head>

<div id="main-container">

  <CircleSquareLogoButton />
  <Title />

  <Nav {links} />
  <div id="observe-resize">
    <slot />
  </div>

</div>
