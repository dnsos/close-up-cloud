<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { mapState } from 'vuex'
import VizCutout from '../components/VizCutout.vue'
import { getOccurrenceUID } from '../utils.js'

export default {
    name: 'viz-detail',
    objectViewport: null,
    sprite: null,
    computed: mapState(['PIXIApp', 'canvas', 'viewport']),
    props: {
        object: {
            //in case we get no object prop passed down, try to fetch it from the store
            default: function () {
                if (this.$route.params.id) {
                    return this.$store.getters.object(this.$route.params.id)
                } else {
                    console.warning('initialized VizDetail without id')
                }
            }
        }
    },
    watch: {
        canvas(newval, oldval) {
            
            
            //center detail image
            if(this.sprite) {
                this.sprite.position.set(newval.width/2, newval.height/2)
            }
        }
    },
    beforeMount: function() {
        console.log("hello this is a detail view")

        const loader = new PIXI.Loader()
        loader
            .add(this.object.id, `assets/images/thumb/${this.object.id}/${this.object.id}.jpg`)
            .load((loader, resources) => {

                const texture = resources[this.object.id].texture
                const textureHeight = texture.baseTexture.height
                const textureWidth = texture.baseTexture.width
                const sprite = this.sprite = new PIXI.Sprite(texture)
                sprite.alpha = 0;
                
                this.viewport.addChild(sprite) 
                TweenLite.to(sprite, 1, {alpha: 1});

                sprite.anchor.set(0.5)
                sprite.position.set(this.canvas.width/2, this.canvas.height/2)                

                const desiredHeight = this.canvas.height
                const ratio = (desiredHeight / textureHeight)
                this.viewport.setZoom(ratio, true)

            });
    },
    mounted: function () {

        //htmlviz
        this.$refs.detail.style.backgroundImage = `url(assets/images/thumb/${this.object.id}/${this.object.id}.jpg)`;
    },
    beforeDestroy: function () {
        this.viewport.removeChild(this.sprite)
    }
}
</script>

<style scoped lang="scss">
</style>
