<template>
  <div id="stock">
    <transition name="coin">
      <div :key="tokens.yellow" v-if="tokens.yellow > 0" class="token one">{{ tokens.yellow }}</div>
    </transition>
    <div id="container" :class="[status]">
      <div id="top">
        <img id="icon" :src="require('@/assets/'+type+'.svg')" alt="">
        <transition name="number" mode="out-in">
          <div id="cost" :key="cost">
            <div>{{ cost }}$</div>
          </div>
        </transition>
      </div>
      <canvas ref="graphRef" id="graph"></canvas>
      <div id="sum">Total: {{ sum }}$</div>
    </div>
    <transition name="coin">
      <div :key="tokens.blue" v-if="tokens.blue > 0" class="token two">{{ tokens.blue }}</div>
    </transition>  </div>
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
      graph.width = graph.clientWidth
      graph.height = graph.clientHeight
      c.clearRect(0, 0, graph.width, graph.height)
      const thickness = graph.height / 10
      const fontSize = 1.2 * thickness

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
        data = [data[0], data[0]]
      }
      const partsY = (availableHeight - fontSize * 2) / (maxY - minY + 1)
      const partsX = availableWidth / (data.length - 1)
      const getXPixel = (i) => padding + partsX * i
      const getYPixel = (val) => padding + partsY * (maxY - val)

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
      c.lineTo(availableWidth + 2 * padding, getYPixel(data[data.length - 1]))

      // DRAWING THE GRAPH FILL
      if (props.status === 'up') {
        c.lineTo(availableWidth + 2 * padding, availableHeight + 2 * padding); // almost bottom-right
        c.lineTo(0, availableHeight + 2 * padding); // almost bottom-left
      } else {
        c.lineTo(availableWidth + 2 * padding, 0); // top-right
        c.lineTo(0, 0); // top-left
      }
      c.lineTo(0, getYPixel(data[0]))
      c.globalCompositeOperation = "destination-over";
      c.fill();
      c.globalCompositeOperation = "source-over";

      // DRAWING THE VALUES

      c.fillStyle = '#ffffff';
      c.font = fontSize + 'px arial';
      c.textBaseline = "middle"
      c.textAlign = "center"
      const getXFontPixel = (val) => padding + fontSize / 4 + (availableWidth - fontSize / 2) / (data.length - 1) * val
      for (let i = 0; i < originalData.length; i++) {
        c.fillText(originalData[i], getXFontPixel(i), availableHeight - thickness / 2);
      }

    }

    const graphRef = ref(null)
    const sum = computed(() => {
      let s = 0
      for (const num in props.history) s += props.history[num]
      return s
    })

    const prepareHistory = (history) => {
      if (history.length < 6)
        return history
      else
        return history.slice(history.length - 6, history.length)
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

    return {graphRef, cost, sum, prepareHistory}
  }
}
</script>

<style scoped lang="scss">
/*@keyframes drop {
  0% {
    transform: scale(4);
    opacity: 0;
  }
  60%{
    transform: scale(1) rotateY(0);
    opacity: 1;
  }
  65% {
  transform: scale(1.4) rotateY(70deg);
  }
  80% {
    transform: scale(2) rotateY(180deg);
  }!*
  75% {
    transform: scale(1.45) rotateY(220deg);
  }*!
  100% {
    transform: scale(1) rotateY(360deg);
  }
}*/
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 60vh;
  width: 60vh;

  .token {
    border-radius: 50%;
    font-size: 6vh;
    width: 10vh;
    height: 10vh;
    background: aqua;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    line-height: 10vh;
    font-family: 'SFBold', serif;
    color: white;

    &.one {
      background: $bright-yellow;
      left: 1vh;
      top: 1vh;
    }

    &.two {
      background: $bright-blue;
      right: 1vh;
      bottom: 1vh;
    }
  }

  #container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-around;
    border-radius: 20%;
    padding: 7%;
    height: 44vh;
    width: 44vh;
    transition: background-color 1s ease;

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
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 24vh;

      #cost {
        > div {
        }
        font-size: 13vh;
      }

      #icon {
        width: 16vh;
        height: 16vh;
      }
    }

    #graph {
      //width: 70%;
      height: 24vh;
    }

    #sum {
      text-align: center;
      font-size: 4vh;
      font-family: 'SFBold', serif;
    }
  }
}
</style>