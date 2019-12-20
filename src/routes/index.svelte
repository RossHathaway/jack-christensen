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
    font-style: italic;
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
    font-size: 36px;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 10px;
    }
  }
</style>

<script>
  let centuryFonts = ['PT Serif', 'Lora', 'Noto Serif', 'Crimson Text', 'Vollkorn', 'Crimson Pro', 'Gelasio']

  let lucidaFonts = ['Merriweather', 'Roboto Slab', 'Playfair Display', 'Arvo', 'Alegreya', 'Cardo']
</script>

<svelte:head>
  <title>Jack Shields Christensen</title>
</svelte:head>

<!-- {#each centuryFonts as font }
<p style="font-family: {font};">
  {font}: 
&#257; a 
&#275; e 
&#299; i
&#333; o
&#363; u
&#563; y
&Amacr; A
&Emacr; E
&Imacr; I
&Omacr; O
&Umacr; U
‘?’ “!”
'abc' "def" it's
</p>
{/each}

{#each lucidaFonts as font }
<p style="font-family: {font};">
  {font}: 
&#257; a
&#275; e
&#299; i
&#333; o
&#363; u
&#563; y
&Amacr; A
&Emacr; E
&Imacr; I
&Omacr; O
&Umacr; U
‘?’ “!”
'abc' "def" it's
</p>
{/each} -->

<!-- <h2>
  &#257; a
  &#275; e
  &#299; i
  &#333; o
  &#363; u
  &#563; y
  &Amacr; A
  &Emacr; E
  &Imacr; I
  &Omacr; O
  &Umacr; U
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

<p>
  &#257; a
  &#275; e
  &#299; i
  &#333; o
  &#363; u
  &#563; y
  &Amacr; A
  &Emacr; E
  &Imacr; I
  &Omacr; O
  &Umacr; U
</p> -->

<div class="photo-wrapper">
  <img alt='Jack in Hawaii' src='uncle-jack-in-hawaii.jpg'>
  <img alt='Jack on diving tower' src='uncle-jack-on-diving-tower.jpg'>
</div>