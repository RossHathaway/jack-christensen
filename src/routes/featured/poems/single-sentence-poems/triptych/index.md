<script context="module">
  import { genericPreloadForLinks } from 'helpers/genericPreloadForLinks'

  export async function preload(page) {
    return genericPreloadForLinks(page, this)
  }
</script>

<script>
  import Links from 'LinksList.svelte';
  import { makeReadableName } from 'helpers/makeReadableNameFromPath';

  export let links, lastPathSection

  const title = makeReadableName(lastPathSection)
</script>

<main>

<h3 style="text-align: center;">TRIPTYCH</h3> 

Three Rambling Poems By J.S. Christensen
<Links {...{links, title: false}}/>

</main>

