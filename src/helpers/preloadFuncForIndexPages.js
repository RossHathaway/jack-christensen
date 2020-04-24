import axios from 'axios';
import { axiosErrorHandler } from 'helpers';

export async function preload(page) {
  try {
    const { path } = page;
    const removedSlashes = path.split('/');
    const lastPathSection = removedSlashes[removedSlashes.length - 1];

    const res = await axios.get(path + '.json');
    const links = await res.json();

    return { links, lastPathSection };
  } catch (e) {
    console.error(`error getting data from ${path}.json`);
    axiosErrorHandler(e);
  }
}
