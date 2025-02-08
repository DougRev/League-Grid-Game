// lib/kayn.js
import { Kayn, REGIONS } from 'kayn';

const kayn = Kayn(process.env.RIOT_API_KEY)({
  region: REGIONS.EUW,
  locale: 'en_US',
  debugOptions: {
    isEnabled: true,
    showKey: false,
  },
});

export async function fetchChampionData() {
  return await kayn.DDragon.Champion.listDataById();
}
