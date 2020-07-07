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

<svelte:component this={components[component]}>
  <slot name="header" />
</svelte:component>
<main>
  <slot />
</main>
