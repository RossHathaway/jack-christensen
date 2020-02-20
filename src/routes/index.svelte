<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<div>
  <img alt="Jack in Hawaii" src="uncle-jack-on-diving-tower.jpg" />
</div>

<p>
  Jack Shields Christensen, "Uncle Jack", suddenly passed away on May 7, 2018 at
  the age of 87. For creative purposes over the years he was also legally known
  as: Chris Christensen, Scott Burlington, and Reverend "Revi" Fiercely. He was
  fully active to his last day.
</p>
<p>
  This website is a compilation of Jack’s writings on his many life interests
  and projects and is an offering to anyone who might share these interests.
  Jack felt that everyone should take the time to explore their fascinations
  fully and to share their life’s story. This statement by Erwin Schrodinger
  inspired him to document his own reflections:
</p>
<p class="border">
  "If you cannot -- in the long run -- tell everyone what you have been doing,
  your doing has been worthless."
</p>
<p>
  To communicate with the organizers of this website, please write to:
</p>
<p>
  jscinfo@jackshieldschristensen.com
</p>

<style>
  div {
    display: flex;
    justify-content: center;
  }

  h1 {
    text-align: center;
    margin: 0 auto;
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
    text-align: center;
  }

  .border {
    padding-bottom: 1em;
    border-bottom: dotted black 4px;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
