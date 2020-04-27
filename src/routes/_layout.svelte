<script context="module">
  export async function preload() {
    // const featuredLinks = this.fetch('featured-topics.json').then(res => res.json());
    // const categoryLinks = this.fetch('categories.json').then(res => res.json());

    // await Promise.all([featuredLinks, categoryLinks])

    let featuredLinks = await this.fetch('featured-topics.json')
    featuredLinks = await featuredLinks.json()

    let categoryLinks = await this.fetch('categories.json')
    categoryLinks = await categoryLinks.json()

    return { featuredLinks, categoryLinks };
  }
</script>

<script>
  import Links from 'LinksList.svelte';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';
  import Nav from '../components/Nav.svelte';
  import Title from '../components/Title.svelte'

  export let featuredLinks, categoryLinks, segment

</script>

<Title />

<div class="container">

  <Nav {...{featuredLinks, categoryLinks}}/>

  <main>
    <slot></slot>
  </main>

</div>

<style>
  main {
    position: relative;
    max-width: 800px;
    background-color: white;
    padding: 0 2rem 2rem 2rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .container {
    display: flex;
    /* scroll ? */
  }
</style>