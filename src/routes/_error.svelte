<script>
  export let status;
  export let error;

  const dev = process.env.NODE_ENV === "development";
</script>

<style>
  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  p {
    margin: 1rem auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4rem;
    }
  }
</style>

<svelte:head>
  <title>{status}</title>
</svelte:head>
<h2>Page not found</h2>
{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
