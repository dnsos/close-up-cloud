# close-up-cloud

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## Vue Structure for Viz 

### All Tags

```
<Viz> ................ Top Level View, load data
    <VizRenderer> ........ PIXI 
        <VizOverview> ........ Subroute of Viz, map data
            <VizCloud> ........... Cloud Container, forceLayout
                <VizCloudItem> ....... Position in Cloud
                    <VizSample /> ........ Images
                    <VizSample /> …
                </VizCloudItem>
                <VizCloudItem> …
            </VizCloud>
        </VizOverview>
    </VizRenderer>
</Viz>
```

### Tag View

```
<Viz> ................ Top Level View, load data
    <VizRenderer> ........ PIXI 
        <VizTag> ............. Subroute of Viz, map data
            <VizCloud> ........... Cloud Container, forceLayout
                <VizCloudItem> ........ Position in Cloud
                    <VizSample /> ........ Images
                    <VizSample /> …
                </VizCloudItem>
                <VizCloudItem> …
            </VizCloud>
        </VizTag>
    </VizRenderer>
</Viz>
```

### Viz Detail

```
<Viz> ................ Top Level View, load data
    <VizRenderer> ........ PIXI 
        <VizDetail /> ........ Subroute of Viz
    </VizRenderer>
</Viz>
```

## Input for Cloud

### All Tags

```
items = [{
    id: Blumenornamente,
    weight: 20,
    samples: [
        {
            origin: P1232,
            x, y, size
        },
        {
            origin: P1233,
            x, y, size
        }
    ]
},
{
    id: Kastanien,
    weight: 10,
    samples: [
        {
            origin: P1220,
            x, y, size
        },
        {
            origin: P1221,
            x, y, size
        }
    ]
}]
```

### Single Tag

```
items: [{
    id: P1232,
    weight: 5,
    samples: [
        {
            origin: P1232,
            x, y, size
        },
        {
            origin: P1232,
            x, y, size
        },
        {
            origin: P1232,
            x, y, size
        }
    ]
},
{
    id: P1233,
    weight 5,
    samples: [
        {
            origin: P1233,
            x, y, size
        }
    ]
}]
```





// Order of Spread Animation:
// [1] Center the selected CloudItem
// [2] Hide all other CloudItems
// [3] Pre-Load Samples
// [4] Zoom viewport to fit the next view
// [5] Align Samples with the next view
// [6] Spread out all VizCloudSamples
// [7] Route to the target view