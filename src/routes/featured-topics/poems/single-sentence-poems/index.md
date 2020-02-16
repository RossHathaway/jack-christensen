```js exec
  import { stores } from '@sapper/app';
  import Links from '../../../../components/LinksList.svelte';

  const { page } = stores();
  const currentPath = $page.path.endsWith('/') ? $page.path : $page.path + '/';
  const distantPassagesPath = `${currentPath}distant-passages`
```

<h3 style="text-align: center;">SINGLE SENTENCE POEMS</h3> 
WHEN I BECAME EIGHTY YEARS OLD on February 11th 2011,
I decided it was time to show a dozen examples of my poetic efforts that might
interest other persons in crafting some artistic images with words arranged in a
single sentence, as a way to review certain experiences which have persisted in
one's memory and from which we can glean -- if not poetry per se -- at least
poetic residuals of recollections, perhaps including a few reflections of
mystical moments and spiritual insights. 

My selections here are arranged in two
parts. The first is entitled <a href="{distantPassagesPath}">DISTANT PASSAGES</a> comprised of nine pieces written
as souvenirs from several journeys to Japan and Peru: 

Inland Sea 
Miyajima 
Ise
Kyoto Downpour 
The Sacred Valley Of The Incas 
Machu Picchu 
La Pampa de Anta
Izcuchaca 
El Condor Pasa 

The second part is called TRIPTYCH beginning with
another travel fragment followed by my two longest sentences: 

Uncouth Youth
Spring Green Global Hero
