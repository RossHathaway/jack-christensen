<script>
  import Logo from './Logo.svelte'
  let logoSize = 200
</script>

<style>
  header {
    display: flex;
  }
  .title-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: var(--logoSize);
  }
  h1 {
    margin: 0;
  }
</style>

<header>
  <Logo size={logoSize} />
  <div class="title-container" style="--logoSize:{logoSize}">
    <h1>Jack Shields Christensen</h1>
  </div>
</header>