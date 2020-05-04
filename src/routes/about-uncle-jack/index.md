<script context="module">
  import { genericPreloadForLinks } from 'helpers/genericPreloadForLinks'
    import {getAllLinks} from 'helpers/getAllLinks'


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

<Links {...{links, title}}/>
