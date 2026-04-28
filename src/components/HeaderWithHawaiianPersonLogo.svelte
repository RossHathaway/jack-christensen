<style>
  header {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    padding: 1rem;
  }

  header > :global(div) {
    display: flex;
  }

  header :global(.centered) {
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  header :global(.centered > div) {
    flex: 1;
  }

  header :global(.centered div:nth-child(1)) {
    font-weight: bold;
    font-size: 1.8rem;
  }

  header :global(.centered div:nth-child(3)) {
    margin: 0.5rem 4rem 0;
    padding: 0.5rem;
    border-width: 2px 0;
    border-style: solid;
    border-color: black;
  }

  img {
    max-height: 150px;
    max-width: 120px;
  }

  @media screen and (max-width: 600px) {
    header {
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    img {
      max-height: 80px;
      max-width: 70px;
    }

    header :global(.centered div:nth-child(1)) {
      font-size: 1.2rem;
    }

    header :global(.centered div:nth-child(3)) {
      margin: 0.25rem 0.5rem 0;
    }
  }
</style>

<header>
  <img src="logos/hawaiian-person-left.svg" alt="" />
  <slot name="header" />
  <img src="logos/hawaiian-person-right.svg" alt="" />
</header>

<main>
  <slot />
</main>
