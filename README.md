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
```

## Develop

You can test components with storybook.

```
npm run storybook
```

## Build & publish

```
npm build
npm publish
```
