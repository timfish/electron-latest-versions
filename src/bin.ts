#!/usr/bin/env node

import { getLatestVersions } from ".";

const args = process.argv.join(" ");

function getArgNum(name: string): number | undefined {
  const result = args.match(`--${name} (\\d+)`);
  if (result) {
    const num = parseInt(result[1] || "", 10);
    if (!isNaN(num)) return num;
  }
  return undefined;
}

const start = getArgNum("start");
const end = getArgNum("end");
const last = getArgNum("last");

const beta = args.includes("--beta");
const alpha = args.includes("--alpha");

getLatestVersions({ start, end, last, beta, alpha }).then((versions) =>
  console.log(JSON.stringify(versions, null, "  "))
);
