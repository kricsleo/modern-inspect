import eslint from '@antfu/eslint-config';

export default eslint({
  rules: {
    /**
     * Enforce curly braces for all control statements.
     *
     * @see https://eslint.org/docs/latest/rules/curly
     */
    'curly': ['error', 'all'],

    /**
     * Enforce semicolons all the time.
     *
     * @see https://eslint.style/rules/semi
     */
    'style/semi': ['error', 'always'],
  },
});
