// utils/fetchUser.ts
export async function fetchProduct() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  return res.json();
}
