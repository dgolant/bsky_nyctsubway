import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const dbKey = process.env.SHOULD_SEND ? 'prod' : 'test';
const dbAddress = process.env.DB_ADDRESS!;

const dbString = path.join(dbAddress, dbKey);
export async function markSent(id: string): Promise<boolean> {
  const res = await fetch(`${path.join(dbString, 'entity_ids')}.json`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
    },
    body: JSON.stringify({ [id]: true }),
  });
  if (!res.ok) {
    console.error({ url: res.url, status: res.status, statusText: res.statusText, id });
    return false;
  }
  return true;
}

export async function wasSent(id: string): Promise<boolean> {
  const res = await fetch(`${dbString}.json`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const error = {
      ...new Error(`${res.url}: ${res.status} ${res.statusText}`),
      response: res,
    };
    throw error;
  }

  const body = await res.json();

  return body.entity_ids[id] != undefined;
}
