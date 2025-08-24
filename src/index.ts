import ansiRegex from 'ansi-regex';

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

export function inspect(input: any, options?: InspectOptions): string {
  const visited: unknown[] = [];

  if (typeof input !== 'string') {
    input = _inspect(input, options);
  }

  return options?.compact ? escape(input) : input;

  function _inspect(input: any, options?: InspectOptions, pad = ''): string {
    if (visited.includes(input)) {
      return 'Circular(~)';
    }

    const eol = options?.compact ? '' : '\n';
    const nextPad = options?.compact ? '' : pad + ' '.repeat(2);

    if (
      input === null
      || typeof input === 'undefined'
      || typeof input === 'number'
      || typeof input === 'bigint'
      || typeof input === 'boolean'
      || typeof input === 'symbol'
      || input instanceof RegExp
    ) {
      return String(input);
    }

    if (input instanceof Date) {
      return `Date(${input.toISOString()})`;
    }

    if (typeof input === 'function') {
      return `Function(${input.name || '~'})`;
    }

    if (typeof WeakMap !== 'undefined' && input instanceof WeakMap) {
      return 'WeakMap(~)';
    }

    if (typeof WeakSet !== 'undefined' && input instanceof WeakSet) {
      return 'WeakSet(~)';
    }

    if (
      typeof input === 'object'
      && input !== null
      && typeof input.then === 'function'
      && typeof input.catch === 'function'
    ) {
      return 'Promise(~)';
    }

    if (typeof File !== 'undefined' && input instanceof File) {
      return `File(name:${input.name}, size:${input.size})`;
    }

    if (typeof Blob !== 'undefined' && input instanceof Blob) {
      return `Blob(${input.size})`;
    }

    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(input)) {
      return `${input.constructor.name}(${input.byteLength})`;
    }

    if (typeof Event !== 'undefined' && input instanceof Event) {
      return `Event(type:${input.type})`;
    }

    if (typeof URL !== 'undefined' && input instanceof URL) {
      return `URL(${input.toString()})`;
    }

    if (typeof URLSearchParams !== 'undefined' && input instanceof URLSearchParams) {
      return `URLSearchParams(${input.toString()})`;
    }

    if (typeof NodeList !== 'undefined' && input instanceof NodeList) {
      return `NodeList(${input.length})`;
    }

    if (typeof HTMLCollection !== 'undefined' && input instanceof HTMLCollection) {
      return `HTMLCollection(${input.length})`;
    }

    if (typeof Element !== 'undefined' && input instanceof Element) {
      return `Element(${input.tagName.toLowerCase()})`;
    }

    if (input instanceof Error) {
      const formatted = inspectError(input);

      return formatted
        .split('\n')
        .map((line, idx) => {
          if (idx === 0) {
            return line;
          }

          return options?.compact
            ? ' '.repeat(2) + line.trim()
            : pad + line;
        })
        .join('\n');
    }

    if (typeof FormData !== 'undefined' && input instanceof FormData) {
      const entries = [...input.entries()];

      if (entries.length === 0) {
        return 'FormData(0)';
      }

      visited.push(input);

      const plainObj: Record<string, any> = {};
      for (const [key, value] of entries) {
        plainObj[key] = value;
      }
      const stringified = `FormData(${entries.length}) ${_inspect(plainObj, options, pad)}`;

      visited.pop();

      return stringified;
    }

    if (
      (typeof Map !== 'undefined' && input instanceof Map)
    ) {
      if (input.size === 0) {
        return 'Map(0)';
      }

      visited.push(input);

      const plainObj: Record<string, any> = {};
      for (const [key, value] of input.entries()) {
        const stringKey = typeof key === 'string'
          ? key
          : _inspect(key, { ...options, compact: true });
        plainObj[stringKey] = value;
      }
      const stringified = `Map(${input.size}) ${_inspect(plainObj, options, pad)}`;

      visited.pop();

      return stringified;
    }

    if (input instanceof Set) {
      if (input.size === 0) {
        return 'Set(0)';
      }

      visited.push(input);

      const stringified = `Set(${input.size}) ${_inspect([...input.values()], options, pad)}`;

      visited.pop();

      return stringified;
    }

    if (Array.isArray(input)) {
      if (input.length === 0) {
        return '[]';
      }

      visited.push(input);

      const stringified = `[${eol}${input.map((item, idx) => {
        const itemEol = input.length - 1 === idx ? eol : `, ${eol}`;

        let stringified = _inspect(item, options, nextPad);
        if (options?.transform) {
          stringified = options.transform(input, idx, stringified);
        }

        return nextPad + stringified + itemEol;
      }).join('')}${pad}]`;

      visited.pop();

      return stringified;
    }

    if (typeof input === 'object') {
      let objectKeys = getOwnEnumerableKeys(input);

      if (options?.filter) {
        objectKeys = objectKeys.filter(element => options.filter!(input, element));
      }

      if (objectKeys.length === 0) {
        return '{}';
      }

      visited.push(input);

      const stringified = `{${eol}${objectKeys.map((item, idx) => {
        const itemEol = objectKeys.length - 1 === idx ? eol : `, ${eol}`;

        let stringified = _inspect(input[item], options, nextPad);
        if (options?.transform) {
          stringified = options.transform(input, item, stringified);
        }

        return `${nextPad + String(item)}: ${stringified}${itemEol}`;
      }).join('')}${pad}}`;

      visited.pop();

      return stringified;
    }

    input = input.replace(/'/g, '\\\'');
    return `'${input}'`;
  }
}

function inspectError(error: Error): string {
  return _inspectError(error);

  function _inspectError(error: Error, level = 0): string {
    const title = `${error.constructor.name || 'Error'}(${error.message})`;
    const indent = '  '.repeat(level + 1);
    const causedPrefix = level > 0 ? `${indent}[cause]: ` : '';
    const causedError = error.cause
      ? `\n${_inspectError(error.cause as Error, level + 1)}`
      : '';
    const stack = inspectErrorStack(error, level);

    return `${causedPrefix + title}\n${stack}${causedError}`;
  }
}

function inspectErrorStack(error: Error, level = 0): string {
  if (!error.stack) {
    return '';
  }

  const indent = '  '.repeat(level + 1);

  return indent + error.stack
    .split('\n')
    .splice(error.message.split('\n').length)
    .map(l => l.trim())
    .join(`\n${indent}`);
}

function escape(string: string): string {
  return string
    .replace(ansiRegex(), '')
    .replace(/\\/g, '\\\\')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function getOwnEnumerableKeys(object: object): (string | symbol)[] {
  return [
    ...Object.keys(object),
    ...Object.getOwnPropertySymbols(object)
      .filter(key => Object.prototype.propertyIsEnumerable.call(object, key)),
  ];
}
