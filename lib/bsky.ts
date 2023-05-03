import bsky from '@atproto/api';
import process from 'node:process';
const { BskyAgent } = bsky;
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

enum SendMode {
  'PROD',
  'LOCAL',
}
const sendMode = process.env.SHOULD_SEND ? SendMode.PROD : SendMode.LOCAL;

export async function send(text: string, facets = [], _embed = {}, id: string) {
  if (sendMode === SendMode.PROD) {
    const res = await agent.post({
      text,
      facets,
      // embed,
    });
    console.log({ msg: 'posted', ...res });
  } else {
    console.log({
      text,
      id: id,
      facets,
    });
  }
}

// embed stuff
//     {
//       index: { byteStart: bleet.indexOf('>>>') + 3, byteEnd: bleet.indexOf('<<<') },
//       features: [
//         {
//           $type: 'app.bsky.richtext.facet#link',
//           uri: 'https://new.mta.info',
//         }
//       ]
//     }

//     $type: 'app.bsky.embed.external',
//     external: {
//       uri: 'https://github.com/aliceisjustplaying/atproto-starter-kit',
//       title: "alice's atproto starter kit",
//       description: "i'm just playing around with the api",
//     },
//   },
