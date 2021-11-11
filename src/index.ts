import * as https from "https";

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const host = new URL(url).host;
        return get(`https://${host}${res.headers.location}`)
          .then(resolve)
          .catch(reject);
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
}

export async function getLatestVersions(options: Options): Promise<string[]> {
  const json = await get("https://unpkg.com/electron-releases/lite.json");
  const releases = JSON.parse(json) as {
    version: string;
    npm_dist_tags: string[];
  }[];

  const output = [];
  const end = options.end || 1000;

  for (let v = options.start || 1; v <= end; v++) {
    const found = releases.find((release) =>
      release.npm_dist_tags.some((tag) =>
        options.alpha
          ? tag.startsWith(`${v}-`) ||
            tag.startsWith(`beta-${v}-`) ||
            tag.startsWith(`alpha-${v}-`)
          : options.beta
          ? tag.startsWith(`${v}-`) || tag.startsWith(`beta-${v}-`)
          : tag.startsWith(`${v}-`)
      )
    );

    if (found) {
      output.push(found.version);
    } else {
      break;
    }
  }

  if (options.last) {
    return output.slice(options.last * -1);
  }

  return output;
}
