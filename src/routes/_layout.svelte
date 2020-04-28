<script context="module">
  export async function preload() {
    let featuredLinks = this.fetch('featured-topics.json').then(res => res.json());
    let categoryLinks = this.fetch('categories.json').then(res => res.json());

    featuredLinks = await featuredLinks;
    categoryLinks = await categoryLinks;

    return { featuredLinks, categoryLinks };
  }
</script>

<script>
  import Links from 'LinksList.svelte';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';
  import Nav from '../components/Nav.svelte';
  import Title from '../components/Title.svelte'

  const logoSize = 200

  export let featuredLinks, categoryLinks;

</script>


<div class="outer-container">
  
  <Nav {logoSize} {...{featuredLinks, categoryLinks}}/>
  
  <div class="inner-container">
  <Title height={logoSize}/>

  <main>
    <slot></slot>
  </main>
  </div>

</div>

<style>
  main {
    position: relative;
    max-width: 800px;
    padding: 0 2rem 2rem 2rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .outer-container {
    display: flex;
    /* scroll ? */
  }

  .inner-container {
    display: flex;
    flex-direction: column;
  }
</style>