<script>
  import LinksList from './LinksList.svelte';

  const homeSectionLinks = [{path: '/', name: 'About This Site'}, {path: '/about-uncle-jack', name: 'About Uncle Jack'}]
</script>

<nav>
  <ul>
    <LinksList isNav links={homeSectionLinks} className="home" title="HOME"/> 
    <LinksList isNav folder="featured-topics"/> 
    <LinksList isNav folder="categories"/>
    <div class="contact"><h3><a href="./contact">CONTACT</a></h3></div>
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

  :global(.contact h2) {
    font-size: 24px;
  }

  .contact {
    color: white;
    background-color: darkred;
    border: 2px solid black;
    margin-bottom: 2rem;
  }

  .contact a {
    text-decoration: none;
    display: block;
  }
  .contact a:visited {
      color: black;
    }
  .contact a:hover,
  .contact a:active {
      color: green;
    }
</style>
