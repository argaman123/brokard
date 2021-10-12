<template>
  <div v-if="winner != null" id="winner">
    <div :class="[winner.color]">
      <div id="name">{{ winner.name.charAt(0).toUpperCase() + winner.name.slice(1) }} has WON!</div>
      <div id="score">Score: {{ winner.score }}</div>
    </div>
  </div>
  <div id="container" :class="[currentColor]">
    <div id="top-bar">
      <div id="currentTurn"><span id="color" :class="[currentColor]">{{ (currentName || "no one") + "'s" }}</span><br />turn!</div>
      <transition name="card" mode="out-in">
        <div id="cards" :key="cardsLeft">{{cardsLeft}}</div>
      </transition>
    </div>
    <div id="stockContainer">
      <Stock v-for="stock in stocks" v-bind="stock"></Stock>
    </div>
  </div>
</template>

<script>
import Stock from "@/components/Stock";
import {ref} from "vue";
import Socket from "socket.io-client"

export default {
  name: 'App',
  components: {Stock},
  setup() {
    const stocks = ref([])
    const currentColor = ref("")
    const currentName = ref("no one")
    const cardsLeft = ref(0)
    const winner = ref(null)
    const getStatus = (history) => {
      const last = history[history.length - 1]
      const before = history[history.length - 2]
      if (last > before)
        return "up"
      else if (last < before)
        return "down"
      else
        return "constant"
    }

    const socket = Socket("http://77.125.166.73:25123")
    socket.on("init", (data) => {
      stocks.value = data.stocks
      currentColor.value = data.color
      currentName.value = data.name
      cardsLeft.value = data.cardsLeft
      console.log(data)
    })

    socket.on("win", (win) => {
      winner.value = win
    })

    socket.emit("type", "main")

    return {stocks, getStatus, currentColor, currentName, winner, cardsLeft}
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  user-select: none;
}

body {
  font-family: 'SF', serif;
  //overflow: hidden;
}


#app, #winner, #container {
  width: 100%;
  height: 100%;
}

@keyframes grow-animate {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(0%);
  }
  70% {
    transform: translateY(-6%);
  }
  80% {
    transform: translateY(0%);
  }
  95% {
    transform: translateY(-1%);
  }
  100% {
    transform: translateY(0);
  }
}
.card-enter-active {
  transition: all 0.2s ease-in;
}
.card-leave-active {
  transition: all 0.2s ease-in;
}
.card-enter-from {
  transform: translateY(-50%);
  opacity: 0;
}
.card-leave-to {
  transform: translateY(-50%);
  opacity: 0;
}

#winner {
  display: flex;
  justify-content: center;
  align-items: center;
}

#winner > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: grow-animate 1.5s ease-in;
  width: 100vw;
  height: 100vh;

  #name {
    text-align: center;
    font-family: 'SFBold', serif;
    font-size: 10vw;
  }

  #score {
    text-align: center;
    font-family: 'SF', serif;
    font-size: 6vw;
  }

  &.yellow {
    background: #e8b100ff;
  }

  &.blue {
    background: $bright-blue;
    color: white
  }
  &.turquoise {
    background: $bright-turquoise;
    color: white;

  }
}

@keyframes moveright {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 43% 0;
  }
}

#container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  background: url("~@/assets/drawing.svg");
  background-size: 30%;
  animation: moveright 50s linear infinite;
  #top-bar {
    width: 35vw;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    align-items: center;

    #cards {
      width: 23vh;
      height: 23vh;
      border-radius: 3vh;
      text-align: center;
      vertical-align: center;
      line-height: 23vh;
      font-family: 'SFBold', serif;
      font-size: 12vh;
      object-fit: fill;
      background: url("~@/assets/Card-back.svg") no-repeat;
      background-size: 23vh 23vh;
      box-shadow: 1vh 1vh 0 $black;
      color: white;
      margin-bottom: 10vh;
    }
    #currentTurn {
      font-size: 8vh;
      color: white;
      font-family: 'SFBold', serif;
      line-height: 1.8;
      text-align: center;
      #color {
        padding: 2vh 3vh;
        border-radius: 10vh;
        transition: background-color 0.3s linear;
        &.yellow {
          background: $bright-yellow;
        }
        &.blue {
          background: $bright-blue;
        }
        &.turquoise {
          background: $bright-turquoise;
        }
      }
    }
  }

  #stockContainer {
    display: flex;
    width: 65vw;
    height: 100%;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;
  }
}
</style>