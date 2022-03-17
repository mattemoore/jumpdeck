export default function formatFirebasePrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}
