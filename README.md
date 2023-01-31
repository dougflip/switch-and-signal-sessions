# Switch and Signal Sessions

CLI to display Switch & Signal's sessions along with the remaining ticket count

## Requirements

This **requires Node 18+** at the moment because I am trying out native fetch support.

I may drop that requirement in the future.

## Install

Install globally from npm

```sh
npm install --global @dougflip/switch-and-signal-sessions
```

## Usage

View _all_ sessions

```sh
switch-and-signal-sessions
```

View sessions for specific days

```sh
switch-and-signal-sessions tuesday wednesday

# the days match on "startsWith" as long as there is enough to be unique
# the following is enough to get monday, tuesday, wednesday (needs tu as t is ambigious)
switch-and-signal-sessions m tu w
```

## Local Development

#### On the Metal

```sh
# select correct node version and install deps
nvm use && npm install

# run the cli
npm run dev
```

#### Docker

```sh
# build the code
./scripts/dev npm run build
```

## Version 1.0 Checklist

- [ ] Add prices
- [ ] Integrate something like commander for better help output
- [ ] Unit tests - maybe ava?
