<script>
  import LinksList from './LinksList.svelte';

  const homeSectionLinks = [{path: '/', name: 'About This Site'}, {path: '/about-uncle-jack', name: 'About Uncle Jack'}]
</script>

<nav>
  <ul>
    <LinksList links={homeSectionLinks} className="home" title="HOME"/> 
    <LinksList folder="featured-topics"/> 
    <LinksList folder="categories"/>
    <a href="./contact">CONTACT</a>
  </ul>
</nav>

<style>
  nav {
    font-weight: 300;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    max-width: 200px;
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


</style>
