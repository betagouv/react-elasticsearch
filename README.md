# React Elasticsearch

[![Version](https://img.shields.io/npm/v/react-elasticsearch.svg)](https://npmjs.org/package/react-elasticsearch)
[![Downloads](https://img.shields.io/npm/dt/react-elasticsearch.svg)](https://npmjs.org/package/react-elasticsearch)
[![License](https://img.shields.io/npm/l/react-elasticsearch.svg)](https://github.com/rap2hpoutre/react-elasticsearch/blob/master/package.json)

UI components for React + Elasticsearch. Create search applications using declarative components.
## Usage
**👉 [Documentation and playable demo available here](https://react-elasticsearch.raph.site/).**

```jsx
const MySearchComponent = () => (
  <Elasticsearch url="http://example.org/search">
    <SearchBox id="mainSearch" />
    <Facet id="actors" fields={["actors"]} />
    <Facet id="releasedYear" fields={["releasedYear"]} />
    <Results
      id="results"
      items={data =>
        // Map on result hits and display whatever you want.
        data.map(item => <MyCardItem key={item._id} source={item._source} />)
      }
    />
  </Elasticsearch>
);
```

## Install

```
npm i react-elasticsearch
yarn add react-elasticsearch
```

## Develop

You can test components with storybook (20+ examples).

```
npm run storybook
```

## Main features

- 🏝 Released under **MIT licence**.
- 👩‍🎨 Each component is built with React and is **customisable**. Not too much extra features nor magic.
- 💅 It comes with **no style** so it's the developers responsibility to implement their own.
- 🐿 **35.32KB gzipped** for the whole lib, compatible with old browsers: >0.03% usage.
- 🔮 No legacy: **created in 2019**, **updated in 2021** with hooks.

## Why?

We started building the search experience
of the french [Cultural Heritage Open Platform](https://www.pop.culture.gouv.fr/)
with [ReactiveSearch](https://opensource.appbase.io/reactivesearch/), a well-known
search UI components lib for React.
After some weeks, we realized we had spent a lot of time tweaking and hacking the lib;
we had rewrote almost every components ourselves. We opened issues and pull requests on the repository,
but it seemed the lib was a bit stuck in a rewrite process.
We found out that we need a simple lib that can be easily extended with a similar API,
we created this one. This lib has many less feature than others, it's not even a decent competitor.
But since it helped us building a search experiences, it has been released. Hope it could help you!

## Contributing

Open issues and PR here: https://github.com/betagouv/react-elasticsearch
