<script>
  import Nav from '../components/Nav.svelte';
  import Title from '../components/Title.svelte'
  export let segment;
</script>

<style>
  main {
    position: relative;
    max-width: 800px;
    background-color: white;
    padding: 0 2em 2em 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .container {
    display: flex;
    /* scroll ? */
  }
</style>
<Title />

<div class="container">

  <Nav {segment} />

  <main>
    <slot></slot>
  </main>

</div>