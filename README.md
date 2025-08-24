## modern-inspect

[![npm](https://img.shields.io/npm/v/modern-inspect?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/modern-inspect)
[![npm](https://img.shields.io/npm/types/modern-inspect?style=flat&colorA=18181B&colorB=F0DB4F)](https://www.npmjs.com/package/modern-inspect)
[![npm](https://img.shields.io/bundlephobia/minzip/modern-inspect?style=flat&colorA=18181B&colorB=F0DB4F)](https://bundlephobia.com/package/modern-inspect)
[![npm](https://img.shields.io/github/license/kricsleo/modern-inspect.svg?style=flat&colorA=18181B&colorB=F0DB4F)](https://github.com/kricsleo/modern-inspect/blob/master/LICENSE)

A modern lib to format any value into string representations.

Works much like [Node.js - util.inspect](https://nodejs.org/api/util.html#utilinspectobject-options), but without relying on the Node.js runtime. It's useful for displaying (inspecting) any value in the terminal or formatting it as plain text for logs.

## Features

- 🚀 Super tiny (`~1.9kB` gzipped) with no dependencies
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
  filter?: (obj: any, prop: string | number) => boolean

  /**
   * Customize the stringified value of the object.
   */
  transform?: (obj: any, prop: string | number, stringified: string) => string
}
```

## License

❤️ [MIT](./LICENSE) © [Kricsleo](https://github.com/kricsleo)
