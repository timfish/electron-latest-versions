import * as https from "https";
import * as semver from "semver";

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (
        (res.statusCode === 301 ||
          res.statusCode === 302 ||
          res.statusCode === 307) &&
        res.headers.location
      ) {
        return get(res.headers.location).then(resolve).catch(reject);
      }

      let data: Buffer[] = [];
      res.on("data", (chunk: Buffer) => data.push(chunk));
      res.on("error", reject);
      res.on("end", () => resolve(Buffer.concat(data).toString()));
      return;
    });
  });
}

export interface Options {
  start?: number;
  end?: number;
  last?: number;
  beta?: boolean;
  alpha?: boolean;
  nightly?: boolean;
}

export async function getLatestVersions(options: Options): Promise<string[]> {
  const json = await get("https://www.electronjs.org/headers/index.json");
  const releases = JSON.parse(json) as {
    version: string;
  }[];

  const versions = releases.map((r) => r.version);

  const output: string[] = [];
  const end = options.end || 1000;

  for (let v = options.start || 1; v <= end; v++) {
    let found = versions
      .filter((version) => semver.major(version) === v)
      .filter((version) => !version.includes("unsupported"));

    if (!options.beta) {
      found = found.filter((version) => !version.includes("beta"));
    }

    if (!options.alpha) {
      found = found.filter((version) => !version.includes("alpha"));
    }

    if (!options.nightly) {
      found = found.filter((version) => !version.includes("nightly"));
    }

    found = found.sort(semver.rcompare);

    if (found.length > 0) {
      output.push(found[0] as string);
    }
  }

  if (options.last) {
    return output.slice(options.last * -1);
  }

  return output;
}
