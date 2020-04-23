<script context="module">


  export async function preload(page) {
    const { path } = page
    const removedSlashes = path.split('/')
    const lastPathSection = removedSlashes[removedSlashes.length - 1];

    const res = await this.fetch(path + '.json')
    const links = await res.json()

// error handling
// .catch((err) => console.log(`error in fetch from ${fetchPath}.json`))
    return { links, lastPathSection }
  }
</script>

<script>
  import Links from 'LinksList.svelte';
  import { makeReadableName } from 'makeReadableName';

  export let links, lastPathSection

  const title = makeReadableName(lastPathSection)
</script>

<Links {...{links, title}}/>
