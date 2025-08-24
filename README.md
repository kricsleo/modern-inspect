## modern-inspect

[![npm](https://img.shields.io/npm/v/modern-inspect?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/modern-inspect)
[![npm](https://img.shields.io/npm/types/modern-inspect?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/modern-inspect)
[![npm](https://img.shields.io/bundlephobia/minzip/modern-inspect?style=flat&colorA=18181B&colorB=F0DB4F)](https://bundlephobia.com/package/modern-inspect)
[![npm](https://img.shields.io/github/license/kricsleo/modern-inspect.svg?style=flat&colorA=18181B&colorB=F0DB4F)](https://github.com/kricsleo/modern-inspect/blob/master/LICENSE)

A modern library to format any value into a string representation.

Works much like [Node.js - util.inspect](https://nodejs.org/api/util.html#utilinspectobject-options), but without relying on the Node.js runtime. It's usually intended for debugging (displaying) any value in the terminal console or formatting it as plain text for logs.

## Features

- 🚀 Super tiny (`~1.5kB` gzipped) with no dependencies
- 📦 Works in browsers, Node.js, and other environments
- 🎩 Modern implementation
- 💪🏻 Full TypeScript support

## Usage

```bash
pnpm i modern-inspect
```

```ts
import { inspect } from 'modern-inspect';

inspect(1); // => "1"
inspect({ foo: 'bar' }); // => "{foo: 'bar'}"
inspect([
  true,
  new URL('https://example.com'),
  /** some circular obj */
  /** Map, Set, ... */
]);
// => "[true, URL(https://example.com), Circular(~), Map(2) {...}, Set(2) [...]]"
```

## Options

```ts
interface InspectOptions {
  /**
   * If output compacted string (removing newlines and indentation)
   *
   * @default false
   */
  compact?: boolean

  /**
   * Filter out specific properties from the object.
   */
  filter?: (obj: any, prop: string | number | symbol) => boolean

  /**
   * Customize specific value's stringified result.
   */
  transform?: (obj: any, prop: string | number | symbol, stringified: string) => string
}
```

## Thanks

💚 This library is mainly based on (or a fork implementation of) these excellent projects:

- [stringify-object](https://github.com/sindresorhus/stringify-object) by [Sindre Sorhus](https://github.com/sindresorhus)
- [consola](https://github.com/unjs/consola) by [Pooya Parsa](https://github.com/pi0)

## License

❤️ [MIT](./LICENSE) © [Kricsleo](https://github.com/kricsleo)
