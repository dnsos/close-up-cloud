<template>
  <div class="detailobj" ref="detail">
    <h4>Detail View {{object.id}}</h4>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { mapState } from 'vuex'
import VizCutout from './VizCutout.vue'
import { getOccurrenceUID } from '../js/utils.js'

export default {
    name: 'viz-detail',
    objectViewport: null,
    sprite: null,
    computed: mapState(['PIXIApp', 'canvas']),
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
            this.objectViewport.resize(newval.width, newval.height);
            
            //center detail image
            if(this.sprite) {
                this.sprite.position.set(newval.width/2, newval.height/2)
            }
        }
    },
    beforeMount: function() {
        console.log("hello this is a detail view")

        // objectViewport created by pixi-viewport for zoom/pan etc.
        const objectViewport = this.objectViewport = new Viewport({
            screenWidth: this.canvas.width, //will be set on resize
            screenHeight: this.canvas.height,
            worldWidth: 1280,
            worldHeight: 1280,
            interaction: this.PIXIApp.renderer.plugins.interaction
        })  


        /*let sprite = objectViewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        sprite.tint = 0x00ff00
        sprite.width = sprite.height = 1280
        sprite.position.set(0, 0)

        sprite = objectViewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        sprite.tint = 0xff0000
        sprite.width = sprite.height = 64
        sprite.position.set(0, 0)
        
        sprite = objectViewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        sprite.tint = 0xff0000
        sprite.width = sprite.height = 64
        sprite.anchor.set(0.5)
        sprite.position.set(640, 640)
        
        sprite = objectViewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
        sprite.tint = 0xff0000
        sprite.width = sprite.height = 64
        sprite.anchor.set(1)
        sprite.position.set(1280, 1280)*/


        const loader = new PIXI.Loader()
        loader
            .add(this.object.id, `assets/images/thumb/${this.object.id}/${this.object.id}.jpg`)
            .load((loader, resources) => {

                const texture = resources[this.object.id].texture
                const textureHeight = texture.baseTexture.height
                const textureWidth = texture.baseTexture.width
                const sprite = this.sprite = new PIXI.Sprite(texture)
                
                objectViewport.addChild(sprite) 

                sprite.anchor.set(0.5)
                sprite.position.set(this.canvas.width/2, this.canvas.height/2)                

                const desiredHeight = this.canvas.height
                const ratio = (desiredHeight / textureHeight)
                objectViewport.setZoom(ratio, true)

            });
    },
    mounted: function () {

        this.PIXIApp.stage.addChild(this.objectViewport)
        
        //this.sprite.position.set(this.canvas.width/2, this.canvas.height/2)

        this.objectViewport
            .drag()
            .pinch()
            .wheel()
            .decelerate()
            //.clamp({ direction: 'all' })

        //htmlviz
        this.$refs.detail.style.backgroundImage = `url(assets/images/thumb/${this.object.id}/${this.object.id}.jpg)`;
    },
    beforeDestroy: function () {
        this.PIXIApp.stage.removeChild(this.objectViewport)
    }
}
</script>

<style scoped lang="scss">
.detailobj {
    height: 128px;
    background: center no-repeat;
    background-size: contain;
}
</style>
