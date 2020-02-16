```js exec
  import { stores } from '@sapper/app';
  import Links from '../../../../components/LinksList.svelte';

  const { page } = stores();
  const currentPath = $page.path.endsWith('/') ? $page.path : $page.path + '/';
  const distantPassagesPath = `${currentPath}distant-passages`
  const triptychPath = `${currentPath}triptych`
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

1. <a href="{distantPassagesPath}/inland-sea">Inland Sea</a>
1. <a href="{distantPassagesPath}/miyajima">Miyajima</a> 
1. <a href="{distantPassagesPath}/ise">Ise</a>
1. <a href="{distantPassagesPath}/kyoto-downpour">Kyoto Downpour </a>
1. <a href="{distantPassagesPath}/the-sacred-valley-of-the-incas">The Sacred Valley Of The Incas </a>
1. <a href="{distantPassagesPath}/machu-picchu">Machu Picchu </a>
1. <a href="{distantPassagesPath}/la-pampa-de-anta">La Pampa de Anta</a>
1. <a href="{distantPassagesPath}/izcuchaca">Izcuchaca </a>
1. <a href="{distantPassagesPath}/el-condor-pasa">El Condor Pasa </a>

The second part is called <a href="{triptychPath}">TRIPTYCH</a> beginning with
another travel fragment followed by my two longest sentences: 

1. <a href="{triptychPath}/uncouth-youth">Uncouth Youth</a>
1. <a href="{triptychPath}/spring-green">Spring Green</a> 
1. <a href="{triptychPath}/global-hero">Global Hero</a>
