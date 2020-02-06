<script>
  export let title, links;
</script>

<div>
  <h4>{title}</h4>
  <ul>
    {#each links as link}
    <li><a href="{link.url}"></a>{link.title}</li>
    {/each}
  </ul>
</div>

<style>
  ul {
    margin: 0;
    padding: 0;
  }
  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }
  li {
    display: block;
    float: left;
    width: 100%;
  }
</style>
