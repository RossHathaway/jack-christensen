<script>
  import CircleSquareLogo from "./logos/CircleSquareLogo.svelte";

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

  p,
  blockquote {
    text-align: left;
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

  #logo > :global(svg) {
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

  .reverse-color {
    background-color: var(--main-bg-color);
    padding: 0.2rem 0.4rem;
  }

  h2 {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }

  #quote-with-logo {
    display: flex;
  }

  #quote-with-logo > :global(svg) {
    width: 90px;
  }

  #quote-with-logo > blockquote {
    margin-left: 0.5rem;
  }

  @media screen and (max-width: 700px) {
    #quote-with-logo {
      flex-direction: column;
    }
  }
</style>

<button
  id="logo"
  on:focus={() => {
    open = true;
  }}
  on:hover={() => {
    open = true;
  }}
  on:blur={() => {
    open = false;
  }}>
  <!-- circle/square logo -->
  <CircleSquareLogo />

  <section class:open>
    <header>
      <h2>Jack Shields Christensen – Personal Religious Symbol</h2>

      <button
        class="close-button"
        aria-label="close description of Jack's logo">
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
    <p>
      <span class="bold">Jack Shields Christensen</span>
      (1931-2018) first developed this symbol of belief in the mid-1970’s and
      used it continually since. It derived from his studies of Taoism and the
      writings of Lao Tzu. Using the translation from Chinese by Witter Bynner,
      <span class="italic">
        The Way of Live According to Lao Tzu, an American Version
      </span>
      , 1944, the symbol is his personal visual representation of Verse 58,
      lines 12-15 (page 62 of the Capricorn Books Edition, 1962).
    </p>

    <div id="quote-with-logo">
      <CircleSquareLogo />
      <blockquote>
        “... a sound man shall so
        <span class="reverse-color">square the circle</span>
        <br />
        <span class="reverse-color">And circle the square</span>
        as not to injure, not to impede:
        <br />
        The glow of his life shall not daze,
        <br />
        It shall lead.”
      </blockquote>
    </div>

    <p>
      And in his
      <span class="italic">
        Earthling: My Long Journey toward Spiritual Maturity, Part One:
        Elevation Of Consciousness
      </span>
      , in the section named Longhand Affirmations, Jack Shields Christensen
      wrote:
    </p>
    <blockquote>
      <p>
        “Along your way to the high plateau of old age,
        <span class="reverse-color">
          you are always confined within the circle of your consciousness and
          the square of your Quadratic Balance.
        </span>
      </p>
      <p>
        Quadratic Balance is our cultivated awareness of the four components of
        humankind – physical, emotional, rational, spiritual – which comprise
        our evolutionary fore-nature that we must respect conscientiously if we
        are to advance in accord with The True Human Movement.”
      </p>
    </blockquote>

  </section>
</button>
