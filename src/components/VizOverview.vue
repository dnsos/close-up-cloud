<template>
    <div class="overview">
    
        <router-link :to="`/viz/`">hello this is an overview</router-link>
    
        <VizTag v-for="tag in taglist" :tag="tag" :key="tag.title" />
    
    </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizTag from './VizTag'

export default {
    name: 'viz-renderer',
    props: ['bus'],
    components: { VizTag },
    computed: mapState(['PIXIApp', 'taglist', 'canvas']),
    cloudContainer: null,
    data: () => {
        return {
            loaded: false
        }
    },
    watch: {
    },
    methods: {
        initForceLayout() {

            if(this.$store.state.clouds.overview) return;

            const forceInput = this.taglist.map(tag => {
                return {
                    id: tag.title,
                    weight: tag.tagCount
                };
            });

            this.$store.dispatch('computeForceLayout', {
                key: 'overview',
                data: forceInput
            });
        }
    },
    beforeMount: function() {
        console.log("hello this is a overview")

        // create container for tag cloud
        if(!this.cloudContainer) {
            this.cloudContainer = new PIXI.Container()
            this.cloudContainer.name = 'cloudContainer'
            this.PIXIApp.stage.addChild(this.cloudContainer);
        }

        //create cloud overview force layout
        this.initForceLayout();
    },
    mounted: function() {

    },
    beforeDestroy: function () {
        this.PIXIApp.stage.removeChild(this.cloudContainer)
    }
}
</script>

<style scoped lang="scss">
.overview {}
</style>
