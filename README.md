<div align="center">
  <h1 align="center">OData Query Builder</h1>
  <h3 align="center">ODataQueryBuilder is a flexible JavaScript library that allows you to easily and securely build OData v4 queries.</h3>
  <p align="center">
    <a href="https://www.npmjs.com/package/odata-builders">NPM</a>
    ·
    <a href="https://github.com/mustafakemalgordesli/odata-builders/issues">Report Bug</a>
    ·
    <a href="https://github.com/mustafakemalgordesli/odata-builders/issues">Request Feature</a>
  </p>
</div>

## Getting Started

Installation:

```bash
npm install odata-builders
```

and then use the library

```js
import {
  ODataQueryBuilder,
  FilterBuilder,
  OrderDirection,
} from "odata-builders";

const filter = new FilterBuilder()
  .contains("name", "Techno")
  .and()
  .lessThanOrEqual("price", 150)
  .build();

console.log(filter);
//contains(name, 'Techno') and price le 150

const categoryExpandBuilder = new ODataQueryBuilder("").select(["id", "name"]);

const query = new ODataQueryBuilder("Products")
  .filter(filter)
  .orderBy("name", OrderDirection.DESC)
  .select(["id", "name", "price"])
  .expand("Category", categoryExpandBuilder)
  .skip(10)
  .top(5)
  .build();

console.log(query);
//Products?$filter=contains(name, 'Techno') and price le 150&$orderby=name desc&$select=id,name,price&$expand=Category($select=id,name)&$skip=10&$top=5

fetch(`http://localhost:5004/odata/${query}`)
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

## LICENSE

MIT License

Copyright (c) 2024 Mustafa Kemal Gordesli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
