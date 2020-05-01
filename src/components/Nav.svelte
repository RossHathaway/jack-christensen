<script>
  import LinksList from './LinksList.svelte';
  import Logo from './Logo.svelte'

  export let logoSize, featuredLinks, categoryLinks

// {path: '/', name: 'About This Site'},
const homeSectionLinks = [{path: '/about-uncle-jack', name: 'About Uncle Jack'}]
</script>

<div class="outer-container">
  <Logo size={logoSize} />
<nav>
  <ul>
    <li class="home">
    <LinksList isNav links={homeSectionLinks} title="HOME"/> 
  </li>
  <li class="featured">
    <LinksList isNav title="FEATURED TOPICS" folder="featured-topics" links={featuredLinks} /> 
  </li>
  <li class="categories">
    <LinksList isNav title="CATEGORIES" folder="categories" links={categoryLinks} />
  </li>
  <li class="contact">
    <div><h2><a href="./contact">CONTACT</a></h2></div>
  </li>
  </ul>
</nav>
</div>


<style>

  .outer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  nav {
    font-weight: 300;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    /* max-width: 14rem; */
    width: 20rem;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :global(nav > ul > li > div) {
    color: white;
    padding: 0.5rem;
  }

  :global(nav div > h2) {
    font-size: 1.5rem;
    margin: 0;
  }

  :global(nav a:visited) {
    color: white;
  }

  .home, .featured {
    background-color: var(--second-darkest-hue)
  }

  .categories, .contact {
    background-color: var(--darkest-hue)
  }

  .contact {
    margin-bottom: 2rem;
  }

  .contact a {
    text-decoration: none;
    display: block;
  }

  /* a:visited {
    color: var(--second-darkest-hue);
  } */
  
/*
  .contact a:hover,
  .contact a:active {
      color: ?;
    } */
</style>
