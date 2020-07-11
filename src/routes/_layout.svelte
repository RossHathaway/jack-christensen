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
  import Nav from "../components/Nav.svelte";
  import Title from "../components/Title.svelte";

  const logoSize = 180;

  export let links;
</script>

<style>
  .outer-container {
    display: flex;
    min-width: 0;
    /* scroll ? */
  }

  .inner-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }
</style>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Gelasio|Galindo|Noto+Serif&display=swap"
    rel="stylesheet" />
  <title>Jack Shields Christensen</title>
</svelte:head>

<div class="outer-container">

  <Nav {logoSize} {links} />

  <div class="inner-container" id="observe-resize">
    <Title height={logoSize} />
    <slot />
  </div>

</div>
