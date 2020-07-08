<script>
  import HeaderWithHawaiianPersonLogo from "./HeaderWithHawaiianPersonLogo.svelte";
  import HawaiianPersonHeaderAndFooter from "./HawaiianPersonHeaderFooter.svelte";
  import MainNoHeaderOrFooter from "./MainNoHeaderOrFooter.svelte";

  const components = {
    hawaiianPersonHeader: HeaderWithHawaiianPersonLogo,
    hawaiianPersonHeaderAndFooter: HawaiianPersonHeaderAndFooter,
    // linesLogo:
    // dancingPhantoms:
    default: MainNoHeaderOrFooter,
  };
  export let component = "default";
</script>

<svelte:component this={components[component]}>
  <div slot="header">
    <slot name="header" />
  </div>
  <slot />
</svelte:component>
