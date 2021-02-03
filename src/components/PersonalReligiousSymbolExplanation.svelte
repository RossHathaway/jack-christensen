<script>
    import CircleSquareLogo from "./logos/CircleSquareLogo.svelte";
</script>

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

  <style>

  p,
  blockquote {
    text-align: left;
  }
  
  .reverse-color {
    background-color: var(--main-bg-color);
    padding: 0.2rem 0.4rem;
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