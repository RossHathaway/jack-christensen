<svelte:head>
  <title>Blog</title>
</svelte:head>

<h1>Recent posts</h1>

<ul>
  {#each posts as post}
  <!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
        waiting for the 'click' event 
      
        TODO: change link to have propeimport { mdsvex } from 'mdsvex';
r url
      -->
  <li><a rel="prefetch" href="documents/{post.slug}">{post.title}</a></li>
  {/each}
</ul>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>

<script>
  export default {
    preload({ params, query }) {
      return this.fetch(`documents.json`)
        .then((r) => r.json())
        .then((posts) => {
          return { posts };
        });
    }
  };
</script>
