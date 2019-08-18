<template>
    <div class="overview">
        <router-link :to="`/viz/`">hello this is a cloud</router-link>
    
        <VizCloudItem v-for="item in items" :item="item" :cloudname="cloudname" :key="item.id" />

        <!-- @debug single item -->
        <!--VizCloudItem :item="items.find(child => child.id === 'Ziege')" :cloudname="cloudname" /-->
        <!--VizCloudItem :item="items[0]" :cloudname="cloudname" /-->
    
    </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizCloudItem from './VizCloudItem'

export default {
    name: 'viz-cloud',
    props: {
        cloudname: { type: String, required: true },
        items: { type: Array, required: true }
    },
    components: { VizCloudItem },
    computed: mapState(['canvas', 'viewport']),
    data: () => {
        return {
            renderItems: [],
            cloudContainer: null
        }
    },
    watch: {
        canvas(newval, oldval) {   
            this.resize(newval);
        }
    },
    methods: {
        resize(canvas) {

            //center overview cloud
            if(this.cloudContainer) {
                this.cloudContainer.position.set(canvas.width/2, canvas.height/2)
            }

            //zoom to fit
            const cloudBox = this.$store.getters.cloudBBox(this.cloudname);
            const zoom = this.$store.getters.viewportZoom(cloudBox);
            this.viewport.setZoom(zoom, true)
        },
        initForceLayout() {

            //only ever compute once
            if(this.$store.state.clouds[this.cloudname]) return;

            this.$store.dispatch('computeForceLayout', {
                key: this.cloudname,
                data: this.items
            });
        }
    },
    beforeMount: function() {
        console.log("hello this is a cloud", this.items)

        // create container for tag cloud
        //@todo implications of only created once?
        if(!this.cloudContainer) {
            this.cloudContainer = new PIXI.Container()
            this.cloudContainer.name = `cloud-${this.cloudname}`
        }

        //@todo preload all child images?

        //create cloud overview force layout
        this.initForceLayout();
    },
    mounted: function() {

        //@todo prevent double resize call
        this.resize(this.canvas);

        this.viewport.addChild(this.cloudContainer);
    },
    beforeDestroy: function () {
        this.viewport.removeChild(this.cloudContainer)
    }
}
</script>

<style scoped lang="scss">
</style>
