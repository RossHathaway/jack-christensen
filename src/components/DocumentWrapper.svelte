<script>
  import HeaderWithHawaiianPersonLogo from "./HeaderWithHawaiianPersonLogo.svelte";
  import HawaiianPersonHeaderAndFooter from "./HawaiianPersonHeaderFooter.svelte";

  const components = {
    hawaiianPersonHeader: HeaderWithHawaiianPersonLogo,
    hawaiianPersonHeaderAndFooter: HawaiianPersonHeaderAndFooter,
    // linesLogo:
    // dancingPhantoms:
    // default: main element
  };
  export let component = "default";
</script>

<svelte:component this={components[component]}>
  <div slot="header">
    <slot name="header" />
  </div>
  <slot />
</svelte:component>
