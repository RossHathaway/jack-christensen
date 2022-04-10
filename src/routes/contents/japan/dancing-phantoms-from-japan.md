<script>
  import { onMount } from 'svelte'
  import ResizeObserver from 'resize-observer-polyfill';
 
 onMount(function onDancingPhantomsMount() {
   const ro = new ResizeObserver((entries, observer) => {
       for (const entry of entries) {
           const {left, top, width, height} = entry.contentRect;
    
           const section1 = document.getElementById('pictures-section-1')
           const section1FirstChild = document.querySelector('#pictures-section-1 > div:first-of-type')
           const section1SecondChild = document.querySelector('#pictures-section-1 > div:last-of-type')
   
           if (width < 930) {
             section1.style.flexDirection = 'column'
             section1FirstChild.style.alignItems = 'center'
             section1SecondChild.style.alignItems = 'center'
           } else {
             section1.style.flexDirection = 'row'
             section1FirstChild.style.alignItems = 'flex-end'
             section1SecondChild.style.alignItems = 'flex-start'
           }
       }
   });
    
   ro.observe(document.getElementById('observe-resize'));
 })
 
</script>

<style>

  h2 {
    display: grid;
    grid-template-columns: 1fr repeat(3, auto) 1fr;
    grid-column-gap: 0;
    justify-items: center;
    text-decoration:underline;
  }

  h2 > span {
    grid-column-start: 2;
  }

  h2 > img {
    margin-right: auto;
  }

  img {
    margin: 0.25rem;
  }

  img.header {
    max-height: 70px;
  }

  #pictures-section-1 {
    position: relative;
    left: -100px;
    width: calc(100% + 200px);
    display: flex;
  }

  #pictures-section-1 div {
    height: 880px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-self: center;
  }

  #pictures-section-1 > div:first-of-type {
      align-items: flex-end;
  }

  #pictures-section-1 > div:last-of-type {
      align-items: flex-start;
  }

  #pictures-section-2 {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

<main>

<h2>
  <img src="dancing-phantoms/DancingPhantomsFromJapanIcon.svg" alt="Japanese Character" class="header">
  <span>Dancing Phantoms From Japan</span>
</h2>

**PERFORMANCES AVAILABLE DURING AUGUST ANNUALLY**

**DANCING PHANTOMS FROM JAPAN** presents an introduction to the classical Noh dance-drama of Japan, including rarely
seen details of the traditional backstage Costume Ceremony. The program is fully narrated in English.

**INSTEAD OF PERFORMING** a complete Noh matinee that typically lasts several hours, this unique demonstration features the beautifully expressed skills of highly accomplished artists appearing in full costume as characters from selected plays. These dedicated professionals are trained from one generation to the next for their theatrical task of playing legendary roles — while also cultivating an intuitive sensibility for dramatic pauses that suggest life's profound mysteries.

**NOH PLAYS PRESERVE** a "fantasy style" of stage entertainment with roots reaching far back through six hundred years into Japan's medieval past when performers envisioned a mythical realm where phantom figures dance in an unearthly atmosphere of great beauty. Today this extraordinary art form continues to be enjoyed and regarded as the world's most refined and polished emotive art — in a class by itself.

**ENLARGED CHARACTERS** are depicted in Noh theatricals because, rather than reflecting familiar reality, these plays aim at portraying situations that extend beyond common experience and everyday reasoning power. Yet the themes remain simple, emphasizing the essence of a single emotion: love, jealousy, revenge, filial devotion or the heroism of a warrior.

<div id="pictures-section-1">
<div>
<img alt="Noh performer with mask" src="dancing-phantoms/dancing-phantoms-from-japan-2.png" />
<img alt="Noh performers getting ready" src="dancing-phantoms/dancing-phantoms-from-japan-1.png" />
</div>

<div>
<img alt="Noh performer on stage" src="dancing-phantoms/dancing-phantoms-from-japan-edited.png" />
<img alt="photographer taking a picture of the costume area" src="dancing-phantoms/dancing-phantoms-from-japan-4.png" />
</div>

</div>

**NOH PLAYERS WEAR MAGNIFICENT COSTUMES** based on historic fashions which have become artistically abstracted and larger than life. These exotic garments are silken masterpieces, often treasured as family heirlooms valued at many thousands of dollars. The gorgeous effect of such lavish attire is enhanced by a playing area devoid of conventional scenery — befitting the symbolic nature of the drama and the ghostly movement of the figures.

**ACTOR/DANCERS IN LEADING ROLES** resemble sculpture-come-to-life, following prescribed motions for the figure they portray, with every step and gesture devised to suggest the elegant actions of immortal beings. Instead of facial makeup, players in most major parts wear wooden masks that are hand carved to exquisite featherweight and delicately painted with a haunting expression. These antique masks include several distinctive types of faces that come to vibrant life when worn by expert performers.

**CLOSELY ASSOCIATED** with Japan's indigenous religion of Shinto and with Buddhism introduced there during the sixth century, Noh itself has become a nearly religious art  , now regularly produced in only a few custom-built theaters. Occasionally, special outdoor programs are staged at shrines and temples.

**MEMBERS OF THE AUDIENCE** seldom are permitted backstage to view the elaborate dressing of the actors during their ritualistic Costume Ceremony which was presented in public for the first time anywhere in the world, including Japan, at the premiere of this program on August 9, 1980 in the East-West Center's Kennedy Theater at the University Of Hawai'i in Honolulu.

**DANCING PHANTOMS FROM JAPAN** continues inviting audiences to observe a captivating display of creativity as our team of Master Dressers, from the renowned Kanze Kaikan Noh Theater in Kyoto, sets about transforming their fellow professionals into vivid "dancing phantoms" who are then prepared to take command of the stage and perform with marvelous grace.

<div id="pictures-section-2">

<img alt="Noh performer getting dressed" src="dancing-phantoms/dancing-phantoms-from-japan-5.png" />
<img alt="Noh performer in costume" src="dancing-phantoms/dancing-phantoms-from-japan-6.png" />
<img alt="speaker informing audience in Noh performance" src="dancing-phantoms/dancing-phantoms-from-japan-7.png" />

</div>

**DANCING PHANTOMS FROM JAPAN** is excellent for summer arts festivals that already have an established patronage, or it can be presented independently as a cultural event. The same program has been repeated three times during a single day — at ten o'clock in the morning, a matinee
at three o'clock, and an evening performance at eight.

</main>