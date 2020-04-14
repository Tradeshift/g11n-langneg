<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [g11n-langneg](#g11n-langneg)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# g11n-langneg

Language negotiation helpers


### Usage

```typescript
import { Locale, match } from '@tradeshift/g11n-langneg'

const result: Locale = match('pt-Latn-BR', ['da', 'en', 'es', 'pt'])
// result == Locale.parse('pt')`
```

also accepts `Locale` objects as inputs:

```typescript
const result: Locale = match(Locale.parse('pt-Latn-BR'), [Locale.parse('da'), Locale.parse('pt')])
// result === Locale.parse('pt')
```