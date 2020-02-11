<script>
  import axios from 'axios';
  import { stores } from '@sapper/app';
  const { page } = stores();

  let links = [];
  axios
    .get($page.path + '.json')
    .then(({ data }) => {
      links = data;
    })
    .catch((err) => console.error(err));
</script>

<ul>
  {#each links as link}
  <li><a href="{link.path}">{link.name}</a></li>
  {/each}
</ul>
