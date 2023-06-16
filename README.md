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

If you use [nvm](https://github.com/nvm-sh/nvm) you can create an alias to ensure
your shell switches to the correct version of node to run the command.

For example:

```sh
alias skate="nvm exec v18.13.0 switch-and-signal-sessions"
```

## Usage

View _all_ sessions

```sh
switch-and-signal-sessions
```

View sessions for specific days

```sh
switch-and-signal-sessions tuesday wednesday

# the days match on case insensitive "startsWith" - which means "t" and "s" match multiple days
# for example, this outputs both tuesday AND thursday
switch-and-signal-sessions t
```

## Local Development

#### On the Metal

```sh
# select correct node version and install deps
nvm use && npm install

# run the cli
npm run dev

# run the tests
npm t

# build the code and run the local cli with some args
npm run build && node ./dist/cli.js m w f
```

#### Docker

```sh
# build the code
./scripts/dev npm run build
```

## Releasing

1. Create a branch
2. Implement
3. Run `./scripts/bump-version [version]` to set the version
4. Open a PR

On merge to `main` the new version will be release
