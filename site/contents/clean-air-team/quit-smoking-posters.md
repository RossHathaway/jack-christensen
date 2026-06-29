<style>
#observe-resize main {
        max-width: 100%;
    }
#observe-resize section {
        border: 10px solid black;
        margin: 1rem;
        padding: calc(0.5rem + 20px)
    }
#observe-resize .no-padding-visible {
        padding: calc(0.5rem + 10px);
        display: flex;
    }
#observe-resize img {
        width: 100%;
    }
#observe-resize figcaption {
        font-style: italic;
        font-size: 1.5rem;
        max-width: 80%;
        text-align: center;
    }
#observe-resize .byr-border {
        box-shadow: inset 0 0 0 10px var(--yellow),
      inset 0 0 0 20px var(--red);
        -webkit-box-shadow: inset 0 0 0 10px var(--yellow),
      inset 0 0 0 20px var(--red);
        -moz-box-shadow: inset 0 0 0 10px var(--yellow),
      inset 0 0 0 20px var(--red);
    }
#observe-resize .bwr-border {
        box-shadow: inset 0 0 0 10px var(--main-bg-color),
      inset 0 0 0 20px var(--red);
        -webkit-box-shadow: inset 0 0 0 10px var(--main-bg-color),
      inset 0 0 0 20px var(--red);
        -moz-box-shadow: inset 0 0 0 10px var(--main-bg-color),
      inset 0 0 0 20px var(--red);
    }
#observe-resize #autosuggestion {
        background-color: var(--yellow);
    }
#observe-resize #autosuggestion figcaption {
        max-width: 32rem;
        text-align: left;
    }
</style>

<main>
    <section class="byr-border centered no-padding-visible">
        <img src="quit-smoking-posters/dancing-with-cancerettes.png" alt="puppet person controlled by cigarettes"/>
    </section>
    <section id="autosuggestion" class="bwr-border">
        <figure>
            {% include "partials/autosuggestion-logo.njk" %}

            <figcaption>

                THE KEY to __personal behavior modification__
                and __beneficial habit formation__ is simply your
                immediate decision to complete the circle
                of repetition or not to complete the circle
                of repetition . . .

                </figcaption>
        </figure>
    </section>
    <section class="bwr-border">
        <figure>
            <img alt="Japanese style painting" src="quit-smoking-posters/two-japanese-rings-painting.png">
            <figcaption>
                BAD HABITS are only careless circles of repetitious,
                conditioned behavior –– but they have the power
                to keep us wanting what we no longer want.
            </figcaption>
        </figure>
    </section>
    <section class="byr-border">
        <figure>
        <img alt="Antaeus the giant protecting two people" src="quit-smoking-posters/antaeus-the-giant.png">
            <figcaption>
                Good habits are guardians, bad habits are barriers
            </figcaption>
        </figure>
    </section>
</main>
