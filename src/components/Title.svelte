<style>
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--height);
  }

  /* text */
  h1 {
    margin: 0;
    /* height: 100%; will this look better on mobile?*/
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 > svg {
    width: clamp(300px, 800px, 800px);
    max-width: 600px;
  }

  svg > text {
    font-size: 50px;
    font-weight: bold;
  }

  @media (max-width: 800px) {
    h1 > svg {
      max-width: 100%;
    }
  }
</style>

<header>
  <h1>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 180">

      <text x="10" y="110">Jack Shields Christensen</text>

    </svg>
  </h1>
</header>
