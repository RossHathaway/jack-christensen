<script>
  import LinksList from './LinksList.svelte';

  const homeSectionLinks = [{path: '/', name: 'About This Site'}, {path: '/about-uncle-jack', name: 'About Uncle Jack'}]
</script>

<nav>
  <ul>
    <LinksList links={homeSectionLinks}/> 
    <LinksList folder="featured-topics"/> 
    <LinksList folder="categories"/>
    <a href="./contact">CONTACT</a>
  </ul>
</nav>

<style>
  nav {
    font-weight: 300;
    padding: 0 1em;
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
  li {
    display: block;
    float: left;
    width: 100%;
  }
  .selected {
    position: relative;
    display: inline-block;
  }
  .selected::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }
  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
</style>
