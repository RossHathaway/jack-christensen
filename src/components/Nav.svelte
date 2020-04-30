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
    <li>
    <LinksList isNav links={homeSectionLinks} class="home" title="HOME"/> 
  </li>
  <li>
    <LinksList isNav title="FEATURED TOPICS" folder="featured-topics" links={featuredLinks} class=/> 
  </li>
  <li>
    <LinksList isNav title="CATEGORIES" folder="categories" links={categoryLinks}/>
  </li>
  <li>
    <div class="contact"><h2><a href="./contact">CONTACT</a></h2></div>
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
    max-width: 14rem;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :global(ul > li > div) {
    color: white;
    background-color: var(--alt-bg-color-1);
    padding: 0.5rem;
  }

  :global(div > h2) {
    font-size: 1.5rem;
    margin: 0;
  }

  .home, .

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
