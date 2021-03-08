<script>
  import CircleSquareLogo from "./logos/CircleSquareLogo.svelte";
  import PersonalReligiousSymbolExplanation from "./PersonalReligiousSymbolExplanation.svelte";

  let open = false;
</script>

<style>
  * {
    font-family: Gelasio, serif;
    font-size: 1.25rem;
    letter-spacing: 0.02em;
    line-height: 1.5;
  }

  section {
    visibility: hidden;
    display: none;
  }

  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    justify-items: center;
  }

  header > h2 {
    grid-column-start: 2;
  }
  header > button {
    margin-left: auto;
  }

  button {
    background-color: transparent;
    border: none;
  }

  #logo {
    position: relative;
    padding: 0;
    cursor: pointer;
  }

  #logo ~ :global(svg) {
    width: clamp(60px, 180px, 180px);
  }

  .close-button {
    width: 3rem;
    height: 3rem;
    cursor: pointer;
  }

  .close-button > svg {
    width: 2.5rem;
  }

  .open {
    visibility: visible;
    display: block;
    position: absolute;
    top: 80%;
    left: 80%;
    width: 65vw;
    padding: 2rem;
    z-index: 2;

    background-color: white;
    color: black;
    border: 0.5rem solid var(--darkest-hue);

    cursor: auto;
  }

  h2 {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }
</style>

<button
  id="logo"
  on:click={() => {
    open = !open;
  }}
  >
  <!-- display explanation of Jack's personal religious symbol -->
  <CircleSquareLogo />
</button>
<!-- circle/square logo -->

<section class:open>
  <header>
    <h2>
      Jack Shields Christensen – Personal Religious Symbol
    </h2>

    <button
      class="close-button"
      aria-label="close description of Jack's logo"
      on:click={() => {
        open = !open;
      }}
      >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 103.8 103.8">
        <g
          transform="translate(-79.8 -103.8)"
          fill="none"
          stroke="var(--darkest-hue)"
          stroke-width="6.6"
          stroke-linecap="round"
          stroke-linejoin="round">
          <rect
            ry="7.9"
            rx="7.9"
            y="107.1"
            x="83.1"
            height="97.2"
            width="97.2" />
          <path d="M102.3 126.2l59 59M161.2 126.2l-59 59" />
        </g>
      </svg>
    </button>

  </header>
  <PersonalReligiousSymbolExplanation />

</section>