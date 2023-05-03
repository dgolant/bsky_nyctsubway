import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

export async function getAlerts() {
  const res = await fetch('https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts', {
    headers: {
      'x-api-key': process.env.GTFS_KEY!,
    },
  });
  if (!res.ok) {
    const error = {
      ...new Error(`${res.url}: ${res.status} ${res.statusText}`),
      response: res,
    };
    throw error;
  }

  const buffer = await res.arrayBuffer();
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
  // only include alerts, and ignore ids with # in them  which are elevator outages
  return feed.entity.filter((e) => !!e.alert).filter((e) => !e.id.includes('#'));
}
