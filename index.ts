import * as dotenv from 'dotenv';
dotenv.config();

import { getAlerts } from './lib/index.js';

import { wasSent, markSent, send as sendPost } from './lib/index.js';

import * as cron from 'node-cron';

export async function run() {
  const ents = await getAlerts();

  for (const ent of ents) {
    const sentPreviously = await wasSent(ent.id);
    if (sentPreviously) continue;
    if (ent.alert && ent.alert.headerText) {
      const alertHeader = ent.alert.headerText.translation;
      if (!alertHeader) continue;
      const bleet = alertHeader[0].text;
      sendPost(bleet, [], {}, ent.id);
      markSent(ent.id);
    }
  }
}

// every third minute
cron.schedule('*/3 * * * *', async () => {
  await run();
});

