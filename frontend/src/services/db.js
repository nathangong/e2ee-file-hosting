import Dexie from "dexie";

export const db = new Dexie("db");
db.version(1).stores({
  masterKey: "id,value",
});

export async function saveMasterKey(masterKey) {
  await db.masterKey.put({ id: 1, value: masterKey });
}

export async function retrieveMasterKey() {
  try {
    const entry = await db.masterKey.get(1);
    return entry.value;
  } catch (e) {
    return null;
  }
}
