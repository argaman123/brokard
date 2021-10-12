<template>
  <div id="stock">
    <div class="tokens">
      <transition name="coin">
        <div :key="tokens.yellow" v-if="tokens.yellow > 0" class="token one">{{ tokens.yellow }}</div>
      </transition>
      <transition name="coin">
        <div :key="tokens.blue" v-if="tokens.blue > 0" class="token two">{{ tokens.blue }}</div>
      </transition>
      <transition name="coin">
        <div :key="tokens.turquoise" v-if="tokens.turquoise > 0" class="token three">{{ tokens.turquoise }}</div>
      </transition>
    </div>
    <div class="container" :class="[status]">
      <div id="top">
        <div class="topSection">
          <img id="icon" :src="require('@/assets/'+type+'.svg')" alt="">
          <transition name="number" mode="out-in">
            <div id="cost" :key="cost">
              <div>{{ cost }}$</div>
            </div>
          </transition>
        </div>
        <div id="sum">Total: {{ sum }}$</div>
      </div>
      <div ref="graphContainerRef" id="graphContainer">
        <canvas ref="graphRef" id="graph"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onUnmounted, ref, watchEffect} from "vue";

export default {
  name: "Stock",
  props: ['type', 'status', 'history', 'tokens'],
  setup(props) {
    function updateGraph(data) {
      // INIT
      let graph = graphRef.value
      let c = graph.getContext('2d');
      graph.width = graphContainerRef.value.clientWidth
      graph.height = graphContainerRef.value.clientHeight
      c.clearRect(0, 0, graph.width, graph.height)
      const thickness = graph.height / 20
      const fontSize = 2 * thickness

      // CONTAINER INIT
      const padding = thickness / 2
      const availableHeight = graph.height - (2 * padding)
      const availableWidth = graph.width - (2 * padding)
      let minY = data.reduce((p, v) => (p < v ? p : v))
      let maxY = data.reduce((p, v) => (p > v ? p : v))
      const originalData = [...data]
      if (minY === maxY) {
        maxY += 1
        minY -= 1
        //data = [data[0], data[0]]
      }
      const partsY = (availableHeight - fontSize * 2) / 15 //(maxY-minY)
      const partsX = availableWidth / 10
      const getYPixel = (val) => padding + partsY * (/*maxY*/15 - val)
      const getXPixel = (i) => padding + partsX * (i + 10 - data.length + 1)

      // GRAPH STYLE
      c.lineWidth = thickness
      c.lineCap = "round"
      c.lineJoin = "round"
      let gradient
      switch (props.status) {
        case 'up':
          c.strokeStyle = '#20d74c'
          gradient = c.createLinearGradient(0, 0, 0, availableHeight - 2 * fontSize)
          gradient.addColorStop(0, "rgba(32, 215, 76, 0.8)");
          gradient.addColorStop(1, "rgba(54, 61, 53, 0)");
          break
        case 'down':
          c.strokeStyle = '#ff2a2a'
          gradient = c.createLinearGradient(0, 0, 0, availableHeight - 2 * fontSize)
          gradient.addColorStop(0, "rgba(67, 47, 47, 0)");
          gradient.addColorStop(1, "rgba(255, 41, 41, 0.8)");
          break
        case 'constant':
          c.strokeStyle = '#cecece'
          gradient = c.createLinearGradient(0, 0, 0, availableHeight - 2 * fontSize)
          break
      }

      c.fillStyle = gradient;

      // DRAWING THE GRAPH LINE
      data.forEach((pt, i) => c.lineTo(getXPixel(i), getYPixel(data[i])));
      c.stroke();
      c.lineTo(getXPixel(data.length - 1) + padding, getYPixel(data[data.length - 1]))

      // DRAWING THE GRAPH FILL
      if (props.status === 'up') {
        c.lineTo(getXPixel(data.length - 1) + padding, availableHeight + 2 * padding); // almost bottom-right
        c.lineTo(getXPixel(0) - padding, availableHeight + 2 * padding); // almost bottom-left
      } else {
        c.lineTo(getXPixel(data.length - 1) + padding, 0); // top-right
        c.lineTo(getXPixel(0) - padding, 0); // top-left
      }
      c.lineTo(getXPixel(0) - padding, getYPixel(data[0]))
      c.globalCompositeOperation = "destination-over";
      c.fill();
      c.globalCompositeOperation = "source-over";

      // DRAWING THE VALUES

      c.fillStyle = '#ffffff';
      c.font = fontSize + 'px arial';
      c.textBaseline = "middle"
      c.textAlign = "center"
      //const getXFontPixel = (val) => padding + fontSize / 4 + (availableWidth - fontSize / 2) / (data.length - 1) * val
      const getXFontPixel = (i) => padding + fontSize / 4 + (availableWidth - fontSize / 2) / 10 * (i + 10 - data.length + 1)
      for (let i = 0; i < originalData.length; i++) {
        c.fillText(originalData[i], getXFontPixel(i), availableHeight);
      }

    }

    const graphRef = ref(null)
    const graphContainerRef = ref(null)
    const sum = computed(() => {
      let s = 0
      for (const num in props.history) s += props.history[num]
      return s
    })

    const prepareHistory = (history) => {
      if (history.length < 10)
        return history
      else
        return history.slice(history.length - 10, history.length)
    }

    const renderGraph = () => updateGraph(prepareHistory(props.history))

    // RERENDER ON RESIZE
    window.addEventListener("resize", renderGraph);
    onUnmounted(() => {
      window.removeEventListener("resize", renderGraph);
    })

    // RERENDER ON DATA CHANGE
    watchEffect(() => {
      if (graphRef.value == null) return
      renderGraph()
    })

    const cost = computed(() => props.history[props.history.length - 1])

    return {graphRef, graphContainerRef, cost, sum, prepareHistory}
  }
}
</script>

<style scoped lang="scss">
@keyframes drop {
  0% {
    transform: rotateY(-90deg) scale(1.5);
  }
  30%, 60% {
    transform: rotateY(0deg) scale(3);
  }
  70% {
    transform: rotateY(90deg) scale(2.5);
  }
  83% {
    transform: rotateY(180deg) scale(2);
  }
  93% {
    transform: rotateY(270deg) scale(1.5);
  }
  100% {
    transform: rotateY(360deg) scale(1);
  }
}

.coin-enter-active {
  animation: drop 2s linear;
}

.number-enter-active {
  transition: all 0.5s linear;
}

.number-leave-active {
  transition: all 0.3s linear;
}

.number-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.number-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

#stock {
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 18vh;
  display: flex;
  flex-direction: row-reverse;
  .tokens {
    height: 18vh;
    width: 5vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .token {
      border-radius: 50%;
      font-size: 2.5vw;
      width: 3vw;
      height: 3vw;
      text-align: center;
      vertical-align: middle;
      line-height: 3vw;
      font-family: 'SFBold', serif;
      color: white;

      &.one {
        background: $bright-yellow;
      }

      &.two {
        background: $bright-blue;
      }

      &.three {
        background: $bright-turquoise;
      }
    }
  }

  .container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    transition: background-color 1s ease;
    border-radius: 3vw;
    padding: 2vh;
    height: 18vh;

    &.up {
      background: $green;
      color: $bright-green;
    }

    &.down {
      background: $red;
      color: $bright-red;
    }

    &.constant {
      background: $grey;
      color: $bright-grey;
    }

    #top {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 14vw;

      .topSection {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        #cost {
          font-size: 8vh;
          text-align: right;
        }

        #icon {
          height: 8vh;
        }
      }

      #sum {
        text-align: center;
        font-size: 1.5vw;
        width: 100%;
        font-family: 'SFBold', serif;
      }
    }

    #graphContainer {
      width: 40vw;
      margin-right: 2vw;
      height: 18vh;
    }


  }
}
</style>