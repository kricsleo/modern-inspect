import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import { inspect } from '../src';

const circularObj: any = { name: 'circular' };
circularObj.self = circularObj;

const testData = {
  number: 42,
  string: 'hello',
  boolean: true,
  null: null,
  undefined,
  bigint: BigInt(12345678901234567890n),
  symbol: Symbol('mysym'),
  array: [1, 'a', null, undefined, [2, 3]],
  object: { a: 1, b: { c: 2 } },
  func: function testFunc(x: number) { return x * 2; },
  arrowFunc: (x: number) => x + 1,
  regexp: /abc/g,
  date: new Date('2025-08-23T12:34:56Z'),
  error: (() => {
    const cause1 = new Error('Root cause error');
    const cause2 = new Error('Root cause error 2');
    const main = new Error('Test error');
    main.cause = cause1;
    cause1.cause = cause2;
    return main;
  })(),
  map: new Map<any, any>([
    [1, 'one'],
    [2, 'two'],
    ['complexKey', {
      nested: { deep: true },
      date: new Date('2024-01-01T10:30:00Z'),
      error: (() => {
        const mapError = new Error('Map error');
        mapError.cause = new Error('Map inner cause');
        return mapError;
      })(),
      circular: circularObj,
    }],
    [{ keyObj: 'object as key' }, [1, 2, { inner: 'value' }]],
    [Symbol('mapSymbol'), new Set([{ a: 1 }, { b: 2 }])],
  ]),
  set: new Set([
    1,
    2,
    3,
    {
      complex: 'object',
      date: new Date('2024-02-01T15:45:30Z'),
      nested: { arr: [1, 2, { deep: true }] },
    },
    (() => {
      const setError = new Error('Set error with cause');
      setError.cause = new Error('Set inner cause');
      return setError;
    })(),
    circularObj,
    new Map<any, any>([['setKey', 'setValue'], ['nested', { data: true }]]),
    [1, 2, { array: 'in set' }],
  ]),
  weakMap: new WeakMap(),
  weakSet: new WeakSet(),
  typedArray: new Uint8Array([1, 2, 3]),
  buffer: typeof Buffer !== 'undefined' ? Buffer.from('hello') : undefined,
  blob: typeof Blob !== 'undefined' ? new Blob(['blobdata']) : undefined,
  file: typeof File !== 'undefined' ? new File(['filedata'], 'test.txt') : undefined,
  formData: typeof FormData !== 'undefined'
    ? (() => {
        const fd = new FormData();
        fd.append('key', 'value');
        return fd;
      })()
    : undefined,
  event: typeof Event !== 'undefined' ? new Event('test') : undefined,
  url: typeof URL !== 'undefined' ? new URL('https://example.com') : undefined,
  urlSearchParams: typeof URLSearchParams !== 'undefined' ? new URLSearchParams('a=1&b=2') : undefined,
  intl: typeof Intl !== 'undefined' ? new Intl.NumberFormat('en-US') : undefined,
  circular: circularObj,
  nested: {
    arr: [
      { foo: 'bar', baz: [1, 2, 3], inner: { a: [circularObj, { b: new Set([1, 2, 3]) }] } },
      [circularObj, [new Map<any, any>([['x', { y: [new Uint8Array([7, 8, 9]), function (x: any): any { return x; }] }]])]],
      [
        [
          { deepArr: [(() => {
            const rootCause = new Error('Database connection failed');
            const middleCause = new Error('Authentication failed');
            middleCause.cause = rootCause;
            const deepError = new Error('Deep error occurred');
            deepError.cause = middleCause;
            return deepError;
          })(), { url: typeof URL !== 'undefined' ? new URL('https://deep.com') : undefined }] },
        ],
      ],
    ],
    obj: {
      deep: {
        deeper: {
          deepest: 'end',
          again: {
            arr: [1, { set: new Set([circularObj, 5]) }],
            map: new Map<any, any>([[1, { buffer: typeof Buffer !== 'undefined' ? Buffer.from('buf') : undefined }]]),
          },
          circular: circularObj,
          func: function deepFunc(): string { return 'deep'; },
          typed: new Uint8Array([100, 200]),
        },
      },
    },
  },
};

describe('inspect', () => {
  it('output uncompacted string', () => {
    expect(inspect(testData)).toMatchInlineSnapshot(`
      "{
        number: 42, 
        string: 'hello', 
        boolean: true, 
        null: null, 
        undefined: undefined, 
        bigint: 12345678901234567890, 
        symbol: Symbol(mysym), 
        array: [
          1, 
          'a', 
          null, 
          undefined, 
          [
            2, 
            3
          ]
        ], 
        object: {
          a: 1, 
          b: {
            c: 2
          }
        }, 
        func: Function(testFunc), 
        arrowFunc: Function(arrowFunc), 
        regexp: /abc/g, 
        date: Date(2025-08-23T12:34:56.000Z), 
        error: Error(Test error)
          at /Users/kricsleo/w/modern-inspect/test/index.test.ts:25:18
          at /Users/kricsleo/w/modern-inspect/test/index.test.ts:29:3
          at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
          at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
          at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
          at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
          at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
          at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
          at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
          at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)
          [cause]: Error(Root cause error)
            at /Users/kricsleo/w/modern-inspect/test/index.test.ts:23:20
            at /Users/kricsleo/w/modern-inspect/test/index.test.ts:29:3
            at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
            at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
            at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
            at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
            at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
            at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
            at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
            at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)
            [cause]: Error(Root cause error 2)
              at /Users/kricsleo/w/modern-inspect/test/index.test.ts:24:20
              at /Users/kricsleo/w/modern-inspect/test/index.test.ts:29:3
              at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
              at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
              at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
              at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
              at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
              at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
              at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
              at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), 
        map: Map(5) {
          1: 'one', 
          2: 'two', 
          complexKey: {
            nested: {
              deep: true
            }, 
            date: Date(2024-01-01T10:30:00.000Z), 
            error: Error(Map error)
              at /Users/kricsleo/w/modern-inspect/test/index.test.ts:37:26
              at /Users/kricsleo/w/modern-inspect/test/index.test.ts:40:7
              at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
              at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
              at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
              at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
              at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
              at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
              at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
              at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)
              [cause]: Error(Map inner cause)
                at /Users/kricsleo/w/modern-inspect/test/index.test.ts:38:26
                at /Users/kricsleo/w/modern-inspect/test/index.test.ts:40:7
                at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
                at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
                at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
                at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
                at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
                at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
                at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
                at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), 
            circular: {
              name: 'circular', 
              self: Circular(~)
            }
          }, 
          {keyObj: 'object as key'}: [
            1, 
            2, 
            {
              inner: 'value'
            }
          ], 
          Symbol(mapSymbol): Set(2) [
            {
              a: 1
            }, 
            {
              b: 2
            }
          ]
        }, 
        set: Set(8) [
          1, 
          2, 
          3, 
          {
            complex: 'object', 
            date: Date(2024-02-01T15:45:30.000Z), 
            nested: {
              arr: [
                1, 
                2, 
                {
                  deep: true
                }
              ]
            }
          }, 
          Error(Set error with cause)
            at /Users/kricsleo/w/modern-inspect/test/index.test.ts:56:24
            at /Users/kricsleo/w/modern-inspect/test/index.test.ts:59:5
            at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
            at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
            at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
            at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
            at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
            at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
            at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
            at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)
            [cause]: Error(Set inner cause)
              at /Users/kricsleo/w/modern-inspect/test/index.test.ts:57:24
              at /Users/kricsleo/w/modern-inspect/test/index.test.ts:59:5
              at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
              at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
              at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
              at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
              at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
              at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
              at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
              at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), 
          {
            name: 'circular', 
            self: Circular(~)
          }, 
          Map(2) {
            setKey: 'setValue', 
            nested: {
              data: true
            }
          }, 
          [
            1, 
            2, 
            {
              array: 'in set'
            }
          ]
        ], 
        weakMap: WeakMap(~), 
        weakSet: WeakSet(~), 
        typedArray: Uint8Array(3), 
        buffer: Buffer(5), 
        blob: Blob(8), 
        file: File(name:test.txt, size:8), 
        formData: FormData(1) {
          key: 'value'
        }, 
        event: Event(type:test), 
        url: URL(https://example.com/), 
        urlSearchParams: URLSearchParams(a=1&b=2), 
        intl: {}, 
        circular: {
          name: 'circular', 
          self: Circular(~)
        }, 
        nested: {
          arr: [
            {
              foo: 'bar', 
              baz: [
                1, 
                2, 
                3
              ], 
              inner: {
                a: [
                  {
                    name: 'circular', 
                    self: Circular(~)
                  }, 
                  {
                    b: Set(3) [
                      1, 
                      2, 
                      3
                    ]
                  }
                ]
              }
            }, 
            [
              {
                name: 'circular', 
                self: Circular(~)
              }, 
              [
                Map(1) {
                  x: {
                    y: [
                      Uint8Array(3), 
                      Function(~)
                    ]
                  }
                }
              ]
            ], 
            [
              [
                {
                  deepArr: [
                    Error(Deep error occurred)
                      at /Users/kricsleo/w/modern-inspect/test/index.test.ts:92:31
                      at /Users/kricsleo/w/modern-inspect/test/index.test.ts:95:11
                      at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
                      at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
                      at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
                      at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
                      at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
                      at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
                      at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
                      at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)
                      [cause]: Error(Authentication failed)
                        at /Users/kricsleo/w/modern-inspect/test/index.test.ts:90:33
                        at /Users/kricsleo/w/modern-inspect/test/index.test.ts:95:11
                        at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
                        at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
                        at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
                        at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
                        at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
                        at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
                        at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
                        at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)
                        [cause]: Error(Database connection failed)
                          at /Users/kricsleo/w/modern-inspect/test/index.test.ts:89:31
                          at /Users/kricsleo/w/modern-inspect/test/index.test.ts:95:11
                          at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)
                          at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)
                          at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)
                          at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)
                          at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)
                          at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)
                          at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26
                          at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), 
                    {
                      url: URL(https://deep.com/)
                    }
                  ]
                }
              ]
            ]
          ], 
          obj: {
            deep: {
              deeper: {
                deepest: 'end', 
                again: {
                  arr: [
                    1, 
                    {
                      set: Set(2) [
                        {
                          name: 'circular', 
                          self: Circular(~)
                        }, 
                        5
                      ]
                    }
                  ], 
                  map: Map(1) {
                    1: {
                      buffer: Buffer(3)
                    }
                  }
                }, 
                circular: {
                  name: 'circular', 
                  self: Circular(~)
                }, 
                func: Function(deepFunc), 
                typed: Uint8Array(2)
              }
            }
          }
        }
      }"
    `);
  });

  it('output compacted string', () => {
    expect(inspect(testData, { compact: true })).toMatchInlineSnapshot(`"{number: 42, string: 'hello', boolean: true, null: null, undefined: undefined, bigint: 12345678901234567890, symbol: Symbol(mysym), array: [1, 'a', null, undefined, [2, 3]], object: {a: 1, b: {c: 2}}, func: Function(testFunc), arrowFunc: Function(arrowFunc), regexp: /abc/g, date: Date(2025-08-23T12:34:56.000Z), error: Error(Test error)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:25:18\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:29:3\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)\\n  [cause]: Error(Root cause error)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:23:20\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:29:3\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)\\n  [cause]: Error(Root cause error 2)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:24:20\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:29:3\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), map: Map(5) {1: 'one', 2: 'two', complexKey: {nested: {deep: true}, date: Date(2024-01-01T10:30:00.000Z), error: Error(Map error)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:37:26\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:40:7\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)\\n  [cause]: Error(Map inner cause)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:38:26\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:40:7\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), circular: {name: 'circular', self: Circular(~)}}, {keyObj: 'object as key'}: [1, 2, {inner: 'value'}], Symbol(mapSymbol): Set(2) [{a: 1}, {b: 2}]}, set: Set(8) [1, 2, 3, {complex: 'object', date: Date(2024-02-01T15:45:30.000Z), nested: {arr: [1, 2, {deep: true}]}}, Error(Set error with cause)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:56:24\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:59:5\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)\\n  [cause]: Error(Set inner cause)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:57:24\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:59:5\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), {name: 'circular', self: Circular(~)}, Map(2) {setKey: 'setValue', nested: {data: true}}, [1, 2, {array: 'in set'}]], weakMap: WeakMap(~), weakSet: WeakSet(~), typedArray: Uint8Array(3), buffer: Buffer(5), blob: Blob(8), file: File(name:test.txt, size:8), formData: FormData(1) {key: 'value'}, event: Event(type:test), url: URL(https://example.com/), urlSearchParams: URLSearchParams(a=1&b=2), intl: {}, circular: {name: 'circular', self: Circular(~)}, nested: {arr: [{foo: 'bar', baz: [1, 2, 3], inner: {a: [{name: 'circular', self: Circular(~)}, {b: Set(3) [1, 2, 3]}]}}, [{name: 'circular', self: Circular(~)}, [Map(1) {x: {y: [Uint8Array(3), Function(~)]}}]], [[{deepArr: [Error(Deep error occurred)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:92:31\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:95:11\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)\\n  [cause]: Error(Authentication failed)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:90:33\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:95:11\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3)\\n  [cause]: Error(Database connection failed)\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:89:31\\n  at /Users/kricsleo/w/modern-inspect/test/index.test.ts:95:11\\n  at VitestExecutor.runModule (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:397:4)\\n  at VitestExecutor.directRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:375:3)\\n  at VitestExecutor.cachedRequest (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:189:11)\\n  at VitestExecutor.executeId (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vite-node@3.2.4_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vite-node/dist/client.mjs:166:10)\\n  at collectTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1174:4)\\n  at startTests (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/@vitest+runner@3.2.4/node_modules/@vitest/runner/dist/chunk-hooks.js:1817:17)\\n  at file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:117:26\\n  at withEnv (file:///Users/kricsleo/w/modern-inspect/node_modules/.pnpm/vitest@3.2.4_@types+debug@4.1.12_@types+node@18.19.123_jiti@2.5.1_tsx@4.20.5_yaml@2.8.1/node_modules/vitest/dist/chunks/runBaseTests.9Ij9_de-.js:84:3), {url: URL(https://deep.com/)}]}]]], obj: {deep: {deeper: {deepest: 'end', again: {arr: [1, {set: Set(2) [{name: 'circular', self: Circular(~)}, 5]}], map: Map(1) {1: {buffer: Buffer(3)}}}, circular: {name: 'circular', self: Circular(~)}, func: Function(deepFunc), typed: Uint8Array(2)}}}}}"`);
  });
});
