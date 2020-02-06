<script>
  export let title,
    bgColor = 'goldenrod',
    borderColor = 'black',
    links = [];
</script>

<div style="background-color: {bgColor}; --borderColor: {borderColor}">
  <h4>{title.toUpperCase()}</h4>
  <ul>
    {#each links as link}
    <li><a href="{link.url}"></a>{link.title}</li>
    {/each}
  </ul>
</div>

<style>
  div {
    color: white;
    display: flex;
    flex-direction: column;
    text-align: center;
    border: 2px solid var(--borderColor);
  }
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
