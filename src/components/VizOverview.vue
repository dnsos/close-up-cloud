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
        canvas(newval, oldval) {
            //if(this.cloudContainer.x === 0) {
                this.cloudContainer.x = newval.width/2;
                this.cloudContainer.y = newval.height/2;
            //    return;
            //}
            //new TimelineMax()
            //    .add( TweenMax.to(this.cloudContainer, 0.5, {x: width/2, y: height/2}) )
            //    .play()
        }
    },
    methods: {
    },
    beforeMount: function() {
        console.log("hello this is a overview")

        // create containers for tag cloud
        if(!this.cloudContainer) {
            this.cloudContainer = new PIXI.Container()
            this.cloudContainer.name = 'cloudContainer'
            this.PIXIApp.stage.addChild(this.cloudContainer);
        }

        //create cloud overview force layout
        if (!this.$store.state.clouds.overview) {

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
    mounted: function() {

    }
}
</script>

<style scoped lang="scss">
.overview {}
</style>
