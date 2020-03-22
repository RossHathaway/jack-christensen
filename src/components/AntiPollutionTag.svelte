<script>
  import AltLogo from './AltLogo.svelte';
</script>

<div class="outer">
  <div class="logo">
    <AltLogo />
    <!-- <img src="anti-pollution-logo.svg" /> -->
  </div>
  <div class="inner">
    <slot></slot>
  </div>
</div>

<style>
  :root {
    --dark-gray: #231f20;
  }

  .outer {
    display: flex;
    color: var(--dark-gray);
  }

  .inner {
    margin: 4px;
    border-top: dotted 8px var(--dark-gray);
    border-right: dotted 8px var(--dark-gray);
    border-bottom: dotted 8px var(--dark-gray);
    padding: 0.5em 2em;
  }

  .logo {
    position: relative;
    height: 0; 
    width: 100%; 
    padding: 0;
    padding-bottom: 100%; 
  }

  svg {
    position: absolute; 
    height: 100%; 
    width: 100%; 
    left: 0; 
    top: 0;
  }
  /* img {
    height: 100%;
    width: auto;
    /* object-fit: contain;
    width: auto;
    height: auto; 
  } */
</style>
