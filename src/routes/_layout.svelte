<script context="module">
  export async function preload() {
    let links = this.fetch("navLinks.json")
      .then((res) => res.json())
      .catch((e) => console.log("error fetching links in Nav", e));

    links = await links;

    return { links };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import CircleSquareLogoButton from "../components/CircleSquareLogoButton.svelte";
  import Nav from "../components/Nav.svelte";
  import Title from "../components/Title.svelte";

  export let links;

  const OKINA = 'ʻ';

  function processOkina() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style') return NodeFilter.FILTER_REJECT;
          if (parent.classList.contains('okina')) return NodeFilter.FILTER_REJECT;
          return node.nodeValue.includes(OKINA)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(textNode => {
      const parts = textNode.nodeValue.split(OKINA);
      const frag = document.createDocumentFragment();
      parts.forEach((part, i) => {
        if (i > 0) {
          const span = document.createElement('span');
          span.className = 'okina';
          span.textContent = OKINA;
          frag.appendChild(span);
        }
        if (part) frag.appendChild(document.createTextNode(part));
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  onMount(() => {
    processOkina();

    let rafId;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(processOkina);
    });

    const sapperEl = document.getElementById('sapper');
    if (sapperEl) observer.observe(sapperEl, { childList: true, subtree: true });

    return () => observer.disconnect();
  });
</script>

<style>
  #main-container {
    display: grid;
    grid-template-columns: 19rem auto 1fr;
    justify-items: center;
    min-width: 0;
    /* scroll ? */
  }

  #main-container > :global(header) {
    grid-column-start: 2;
    grid-column-end: 4;
  }

  :global(#nav-container) {
    grid-column-start: 1;
    grid-row-start: 2;
  }

  #observe-resize {
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 2;

    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }

  @media screen and (max-width: 1000px) {
    #main-container {
      grid-template-columns: 80px auto 80px;
    }

    #observe-resize {
      grid-column-start: 1;
      grid-column-end: 4;
    }

    :global(#nav-container) {
      grid-column-start: 3;
      grid-row-start: 1;
    }

    #main-container > :global(header) {
      grid-column-end: 3;
    }

    :global(#logo > svg) {
      min-width: 90px;
      max-width: 90px;
    }
  }
</style>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Gelasio|Galindo|Noto+Serif&display=swap"
    rel="stylesheet" />
  <title>Jack Shields Christensen</title>
</svelte:head>

<div id="main-container">

  <CircleSquareLogoButton />
  <Title />

  <Nav {links} />
  <div id="observe-resize">
    <slot />
  </div>

</div>
