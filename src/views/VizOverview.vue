<template>
    <div class="overview">
    
        <router-link :to="`/viz/`">hello this is an overview</router-link>
    
        <VizOverviewTag v-for="tag in taglist" :tag="tag" :key="tag.title" />

        <!-- @debug single tag -->
        <!--VizOverviewTag :tag="taglist.find(child => child.title === 'Ziege')" /-->
    
    </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizOverviewTag from '../components/VizOverviewTag'

export default {
    name: 'viz-renderer',
    props: ['bus'],
    components: { VizOverviewTag },
    computed: mapState(['PIXIApp', 'taglist', 'canvas', 'viewport']),
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

            //zoom to fit
            const cloudBox = this.$store.getters.cloudBBox('overview');
            const zoom = this.$store.getters.viewportZoom(cloudBox);
            
            this.viewport.setZoom(zoom, true)
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

        //@todo preload all child images?

        //create cloud overview force layout
        this.initForceLayout();
    },
    mounted: function() {

        

        //@todo on late mount watch:canvas is not triggered so this is duplicated here
        //if(this.canvas.height) {
            //center
            this.cloudContainer.position.set(this.canvas.width/2, this.canvas.height/2)

            //zoom to fit
            const cloudBox = this.$store.getters.cloudBBox('overview');
            const zoom = this.$store.getters.viewportZoom(cloudBox);
            this.viewport.setZoom(zoom, true)
        //}

        this.viewport.addChild(this.cloudContainer);
    },
    beforeDestroy: function () {
        this.viewport.removeChild(this.cloudContainer)
    }
}
</script>

<style scoped lang="scss">
</style>
