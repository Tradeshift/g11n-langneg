<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [g11n-langneg](#g11n-langneg)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# g11n-langneg

Language negotiation helpers

## release

Semantic release: (Commit conventions)

No new version will be released unless specific commit message is used. See [Commit conventions](https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/convention.md) for details.
If a release is expected, please fix commit messages to align with appropriate format

### Language negotiation usage

```typescript
import { Locale, match } from '@tradeshift/g11n-langneg'

const result: Locale = match('pt-Latn-BR', ['da', 'en', 'es', 'pt'])
// result == Locale.parse('pt')`

// also accepts `Locale` objects as inputs
const result2: Locale = match(Locale.parse('pt-Latn-BR'), [Locale.parse('da'), Locale.parse('pt')])
// result2 == Locale.parse('pt')`
```

If there's no match, it will return the first candidate in the list, so the first element should always be your preferred/default locale.

```typescript
const result: Locale = match('pt', ['en', 'da', 'es'])
// result == Locale.parse('en')`
```

### Locale

#### Parsing (strict and lenient)

```typescript
import { Locale } from '@tradeshift/g11n-langneg'

// lenient parsing of locales, invalid locales will parse to `und`
const locale: Locale = Locale.parse('pt-BR')

// strict parsing of locales will throw errors for invalid locales
try {
    const invalid = Locale.parseStrict('abcdefghijklmnopq')
} catch (e) {
    throw e;
}
```

#### Maximization (Likely Subtags)

Note: g11n-langneg uses a small subset of the likely subtags CLDR data

```typescript
const locale: Locale = Locale.parse('pt-BR')
const maximized: Locale = locale.maximize() // equivalent to 'pt-Latn-BR'
```

#### Accessing and modifying subtags

```typescript
const locale: Locale = Locale.parse('pt-Latn-BR')

const language: string = locale.getLanguage() // pt
const script: string = locale.getScript() // Latn
const region: string = locale.getRegion() // BR

const ptCyrl: Locale = locale.setScript('Cyrl') // pt-Cyrl-BR
const ptPT: Locale = locale.setRegion('PT') // pt-Latn-PT
```
