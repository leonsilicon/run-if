#!/usr/bin/env node

import process from 'node:process'
import qs from 'qs'

const conditions = process.argv.slice(2);
const query = conditions.join("&");
const expected = qs.parse(query);

for (const env in expected) {
  if (process.env[env] !== expected[env]) {
    process.exit(1);
  }
}