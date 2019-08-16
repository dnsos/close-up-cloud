<template>
  <div class="obj" ref="cutout">
    <h4>Detail View</h4>
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
    objectContainer: null,
    //components: { VizCutout },
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
    methods: {
        spread() {
        }
    },
    mounted: function () {

        console.log("hello this is a detail view")

        // objectContainer created by pixi-viewport for zoom/pan etc.
        const objectContainer = this.objectContainer = new Viewport({
            worldWidth: this.canvas.width,
            worldHeight: this.canvas.height,
            interaction: this.PIXIApp.renderer.plugins.interaction
        })
        this.objectContainer.name = 'objectContainer'
        this.objectContainer
            .drag()
            .pinch()
            .wheel()
            .decelerate()

        this.PIXIApp.stage.addChild(this.objectContainer)

        const loader = new PIXI.Loader()
        loader
            .add(this.object.id, `assets/images/thumb/${this.object.id}/${this.object.id}.jpg`)
            .load((loader, resources) => {

                const texture = resources[this.object.id].texture
                const sprite = new PIXI.Sprite(texture)
                sprite.anchor.set(0.5)

                const textureHeight = texture.baseTexture.height
                const textureWidth = texture.baseTexture.width

                const desiredHeight = this.canvas.height
                const ratio = (desiredHeight / textureHeight)

                objectContainer.scale.set(ratio)
                objectContainer.addChild(sprite)
            });



        //this.$refs.cutout.style.backgroundImage = `url(assets/images/thumb/${filename}/${thumbName})`;
    },
    beforeDestroy: function () {
        this.PIXIApp.stage.removeChild(this.objectContainer)
    }
}
</script>

<style scoped lang="scss">
</style>
