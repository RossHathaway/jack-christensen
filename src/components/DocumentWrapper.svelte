<script>
  import HeaderWithHawaiianPersonLogo from "./HeaderWithHawaiianPersonLogo.svelte";
  import HawaiianPersonHeaderAndFooter from "./HawaiianPersonHeaderFooter.svelte";
  import MainNoHeaderOrFooter from "./MainNoHeaderOrFooter.svelte";

  const components = {
    hawaiianPersonHeader: HeaderWithHawaiianPersonLogo,
    hawaiianPersonHeaderAndFooter: HawaiianPersonHeaderAndFooter,
    // linesLogo:
    default: MainNoHeaderOrFooter,
  };
  export let component = "default";
</script>

<svelte:component this={components[component]}>
  <div slot="header">
    <slot name="header">
      <div class="centered">
        <div>UNCLE JACK'S PUBLIC SERVICE PROJECTS</div>
        <div>
          The Clean Air Team &
          <br />
          The Program To Preserve Hawaiian Place Names
        </div>
      </div>
    </slot>
  </div>
  <slot />
</svelte:component>
