<script>
  import LinksList from './LinksList.svelte';
  import Logo from './Logo.svelte'

  export let logoSize, featuredLinks, categoryLinks

const homeSectionLinks = [{path: '/', name: 'About This Site'}, {path: '/about-uncle-jack', name: 'About Uncle Jack'}]
</script>

<div class="outer-container">
  <Logo size={logoSize} />
<nav>
  <ul>
    <LinksList isNav links={homeSectionLinks} className="home" title="HOME"/> 
    <LinksList isNav title="FEATURED TOPICS" folder="featured-topics" links={featuredLinks}/> 
    <LinksList isNav title="CATEGORIES" folder="categories" links={categoryLinks}/>
    <div class="contact"><h2><a href="./contact">CONTACT</a></h2></div>
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
  }

  :global(ul > div) {
    color: var(--alt-text-color-1);
    background-color: var(--alt-bg-color-1);
    padding: 0.25rem;
  }

  :global(ul > div > h2) {
    font-size: 1.5rem;
    margin: 0;
  }

  .contact {
    margin-bottom: 2rem;
  }

  .contact a {
    text-decoration: none;
    display: block;
  }

  /* a:visited {
    color: var(--alt-text-color-1);
  } */
  
/*
  .contact a:hover,
  .contact a:active {
      color: ?;
    } */
</style>
