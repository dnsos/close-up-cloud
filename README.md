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


## Image Sizes

Full Detail Images are available in different resolutions, based on their original size (100%, 50%, 25%, 12.5%). At 100% they are up to 6000 Pixels wide/tall.

Viewport zoom "1" is equivalent to viewing a detail image at 100% percent resolution.
You can only zoom out, not zoom in more than "1".

Cutouts in Clouds are only available in one resolution, that is 64x64 at it's smallest (64x64 equals a cloud item with weight "1"). 


## Data Structures

### Object

### Sample



### Cloud Items (Input Data for VizCloud)

```
items = [{
    id: Sterne,
    weight: 20,
    samples: [
        {
            id: 'P2017.3.1609-Sterne-701-1962'
        },
        {
            id: 'P2017.3.1609-Sterne-778-2300'
        }
    ]
},
{
    id: Kastanien,
    weight: 10,
    samples: [
        {
            id: 'P2017.3.1409-Kastanien-701-1962'
        },
        {
            id: 'P2017.3.1409-Kastanien-778-2300'
        }
    ]
}]
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
        <VizDetail> ........ Subroute of Viz
            <VizDetailRegion />
        </VizDetail>
    </VizRenderer>
</Viz>
```



// Order of Spread Animation:
// [1] Center the selected CloudItem
// [2] Hide all other CloudItems
// [3] Pre-Load Samples
// [4] Zoom viewport to fit the next view
// [5] Align Samples with the next view
// [6] Spread out all VizCloudSamples
// [7] Route to the target view