<script>
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

  button {
    background-color: transparent;
    border: none;
  }

  #outer-button {
    position: relative;
    padding: 0;
  }

  .close-button {
    color: white;
    font-size: 1.25rem;
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

    background-color: var(--darkest-hue);
    color: white;
    border: 0.5rem solid var(--darkest-hue);
    box-shadow: inset 0 0 0 0.5rem white;
  }

  .reverse-color {
    background-color: var(--alt-bg-color-2);
    color: var(--darkest-hue);
    padding: 0.2rem 0.4rem;
  }

  h2 {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }
</style>

<button
  id="outer-button"
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
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 308 308">
    <path
      d="M139.5 40.1c-12.2 1.6-22.7 4.8-35 10.9C91 57.6 84.6 62 74.6 71.8 31.1
      114 27.7 182.7 66.8 228.5c30.4 35.5 79.4 49.2 123.4 34.5 39.4-13.2
      67.1-44.4 76.4-86.2 2.4-10.6
      2.4-33.7.1-44.8-13-60.3-67.2-99.4-127.2-91.9zm36 13.4c37.5 7.8 68.5 37.6
      78.1 75.4 9.1 35.4-1.4 72.9-27.8 98.8-8.1 8-14.2 12.4-24.8 17.8-52.1
      26.3-114.6 4.9-139.5-47.8-8-16.8-11-34.1-9.4-53 2.9-33.7 23-64.2 53.4-81.2
      19.7-11 46.6-14.8 70-10z" />
    <path
      d="M91.2 154.4l.3 63.4 64.3.7 64.2.7V91H91l.2 63.4zM205.4 105c.7.8 1.6
      84.3.9 92.7l-.6 7.3H104V103.9l50.4.3c27.7.2 50.7.5 51 .8z" />
    <path
      d="M142.3 117.4c-12.7 4.1-22.6 14.7-26 27.9-3 11.9 1.1 26.4 10.4 35.8 24.9
      25.5 68.7 5.8
      66-29.7-1-13.4-9.5-25.8-22.1-31.9-5-2.5-7.4-3-15-3.2-5.8-.2-10.7.2-13.3
      1.1zm17.9 12.2c4.4.7 11.9 5.8 15.2 10.3 6.9 9.3 5.7 22.9-2.8 31.9-8.8
      9.5-21.9 10.6-33.2 2.9-12.3-8.3-14.5-25.9-4.7-36.8 1.9-2.1 5-4.8 6.8-5.9
      3.5-2.1 10.8-4 13.5-3.4.8.1 3.2.6 5.2 1z" />
  </svg>

  <section class:open>
    <button class="close-button">
      close
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 103.8 103.8"
        height="3rem">
        <g
          transform="translate(-79.8 -103.8)"
          fill="none"
          stroke="white"
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

    <h2>Jack Shields Christensen – Personal Religious Symbol</h2>
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
