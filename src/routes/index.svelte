<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    font-style: oblique;
  }

  .photo-wrapper {
    display: flex;
    justify-content: space-between;
  }

  /* img { */
  /* height: 100%; */
  /* max-width: 400px; */
  /* } */

  p {
    margin: 1em auto;
    font-weight: bold;
    font-style: oblique;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Jack Shields Christensen</title>
</svelte:head>
<h2>
  &#257; a
  &#275; e
  &#299; i
  &#333; o
  &#363; u
  &#563; y
</h2>

<h2>
  quotes copied from google font website: ‘?’ “!”
</h2>

<h2>
  default quote key: 'abc' "def" it's
</h2>


<h2>
  html codes
  34: &#34; <br />
  x22: &#x22;<br />
  39: &#39;<br />
  x27: &#x27;<br />
  96: &#96;<br />
  x60: &#x60;<br />
  65282: &#65282;<br />
  xFF02: &#xFF02;<br />
  65287: &#65287;<br />
</h2>

<p>asdf paragraph <b>asdflkjasd</b> </p>

<div class="photo-wrapper">
  <img alt='Jack in Hawaii' src='uncle-jack-in-hawaii.jpg'>
  <img alt='Jack on diving tower' src='uncle-jack-on-diving-tower.jpg'>
</div>

<script>
  import FontFaceObserver from 'fontfaceobserver'
  (function () {
    // Optimization for Repeat Views
    if (sessionStorage.criticalFoftFontsLoaded) {
      document.documentElement.className += " fonts-stage-1 fonts-stage-2";
      return;
    }

    var fontASubset = new FontFaceObserver('LucidaTypewriterSubset');
    Promise.all([fontASubset.load()]).then(function () {
      document.documentElement.className += " fonts-stage-1";
      var fontA = new FontFaceObserver('LucidaTypewriter');
      var fontB = new FontFaceObserver('LucidaTypewriterBold');
      var fontC = new FontFaceObserver('LucidaTypewriterItalic');
      var fontD = new FontFaceObserver('LucidaTypewriterBoldItalic');
      Promise.all([fontA.load(), fontB.load(), fontC.load(), fontD.load()]).then(function () {
        document.documentElement.className += " fonts-stage-2";
        // Optimization for Repeat Views
        sessionStorage.criticalFoftFontsLoaded = true;
      });
    });
  })();
</script>