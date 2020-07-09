<script>
  import Header from "./HeaderWithHawaiianPersonLogo.svelte";
  import Footer from "./PrivateOutingsFooter.svelte";
</script>

<Header>
  <div class="centered" slot="header">
    <div>UNCLE JACK'S PUBLIC SERVICE PROJECTS</div>
    <div>
      The Clean Air Team &
      <br />
      The Program To Preserve Hawaiian Place Names
    </div>
  </div>
</Header>

<main>
  <slot />
</main>

<Footer />
