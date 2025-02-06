// app/lib/testFetchTourBySlug.js

import { fetchTourBySlug } from "./fetchTourBySlug";

const test = async () => {
  const slug = "samaki-samaki";
  const tour = await fetchTourBySlug(slug);
  console.log("Fetched Tour:", tour);
};

test();
