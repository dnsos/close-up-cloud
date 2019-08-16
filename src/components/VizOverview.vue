<template>
    <div class="overview">
    
        <router-link :to="`/viz/`">hello this is an overview</router-link>
    
        <VizOverviewTag v-for="tag in taglist" :tag="tag" :key="tag.title" />
    
    </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizOverviewTag from './VizOverviewTag'

export default {
    name: 'viz-renderer',
    props: ['bus'],
    components: { VizOverviewTag },
    computed: mapState(['PIXIApp', 'taglist', 'canvas']),
    cloudContainer: null,
    data: () => {
        return {
            loaded: false
        }
    },
    watch: {
        canvas(newval, oldval) {
            //center overview cloud
            if(this.cloudContainer) {
                this.cloudContainer.position.set(newval.width/2, newval.height/2)
            }
        }
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
        }

        //create cloud overview force layout
        this.initForceLayout();
    },
    mounted: function() {

        //center
        this.cloudContainer.position.set(this.canvas.width/2, this.canvas.height/2)

        this.PIXIApp.stage.addChild(this.cloudContainer);
    },
    beforeDestroy: function () {
        this.PIXIApp.stage.removeChild(this.cloudContainer)
    }
}
</script>

<style scoped lang="scss">
.overview {}
</style>
