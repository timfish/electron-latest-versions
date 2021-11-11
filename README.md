# `electron-latest-versions`

Gets the latest versions of Electron for a range of major versions.

## api

```ts
function getLatestVersions(options: {
  start?: number;
  end?: number;
  last?: number;
  beta?: boolean;
  alpha?: boolean;
}): Promise<string[]>;

const versions = await getLatestVersions({ last: 5, beta: true });
```

## cli

```shell
> electron-latest-versions --last 6
[
  "10.4.7",
  "11.5.0",
  "12.2.2",
  "13.6.1",
  "14.2.1",
  "15.3.1"
]
```

```shell
> electron-latest-versions --start 13 --beta
[
  "13.6.1",
  "14.2.1",
  "15.3.1",
  "16.0.0-beta.8"
]
```
