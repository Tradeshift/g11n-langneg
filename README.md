<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [g11n-langneg](#g11n-langneg)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# g11n-langneg

Language negotiation helpers


### Usage

```
import { Locale, negotiate } from '@tradeshift/g11n-langneg'

const result: Locale = negotiate('pt-Latn-BR', ['da', 'en', 'es', 'pt'])
// returns `new Locale('pt')`
```
