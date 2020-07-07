<style>
  header {
    display: flex;
    justify-content: space-evenly;
  }

  .centered {
    padding: 0 0.5rem;
  }

  .centered div:nth-child(1) {
    font-weight: bold;
  }

  .centered div:nth-child(2) {
    font-weight: bold;
    font-size: 2rem;
    padding-top: 0.5rem;
  }
</style>

<header>
  <img src="logos/hawaiian-person-left.svg" alt="" />
  <slot>
    <div class="centered">
      <div>UNCLE JACK'S PUBLIC SERVICE PROJECTS</div>
      <div>
        The Clean Air Team &
        <br />
        The Program To Preserve Hawaiian Place Names
      </div>
    </div>
  </slot>
  <img src="logos/hawaiian-person-right.svg" alt="" />
</header>
