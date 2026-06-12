import { giantsData } from "../src/data/giants";
import fs from 'fs';

const slugs = giantsData.map(g => g.slug);
console.log("Current slugs (" + slugs.length + "):", slugs.sort());
