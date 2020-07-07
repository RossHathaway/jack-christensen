<script>
  import HeaderWithHawaiianPersonLogo from "./HeaderWithHawaiianPersonLogo.svelte";

  const components = {
    hawaiianPersonHeader: HeaderWithHawaiianPersonLogo,
    // hawaiianPersonHeaderAndFooter:
    // linesLogo:
    // dancingPhantoms:
    // default: main element
  };
  export let component = "default";
</script>

<svelte:component this={components[component]} />
<main>
  <slot />
</main>
