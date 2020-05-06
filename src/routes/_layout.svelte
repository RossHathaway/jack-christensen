<script context="module">
  export async function preload() {
    let links = this.fetch('navLinks.json').then(res => res.json()).catch((e) => console.log('error fetching links in Nav', e));

    links = await links
    console.log('links:', links)

    return { links };
  }
</script>

<script>
  import Links from 'LinksList.svelte';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';
  import Nav from '../components/Nav.svelte';
  import Title from '../components/Title.svelte'

  const logoSize = 200

  export let links;
</script>

<svelte:head>
  <link
      href="https://fonts.googleapis.com/css?family=Galindo|Noto+Serif&display=swap"
      rel="stylesheet"
    />
  <title>Jack Shields Christensen</title>
</svelte:head>

<div class="outer-container">
  
  <Nav {logoSize} {links}/>
  
  <div class="inner-container">
  <Title height={logoSize}/>

  <main>
    <slot></slot>
  </main>
  </div>

</div>

<style>
  main {
    position: relative;
    max-width: 800px;
    padding: 0 2rem 2rem 2rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .outer-container {
    display: flex;
    /* scroll ? */
  }

  .inner-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>