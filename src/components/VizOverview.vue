<template>
    <div class="overview">
        hello this is an overview
        <VizTag v-for="tag in taglist" :tag="tag" :key="tag.title" />
    </div>    
    
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizTag from './VizTag'

export default {
    name: 'viz-renderer',
    components: { VizTag },
    computed: mapState(['taglist']),
    data: () => {
        return { 
            loaded: false 
        }
    },
    mounted: function() {
    }
}
</script>

<style scoped lang="scss">
.overview {
    overflow: scroll;
}
</style>
