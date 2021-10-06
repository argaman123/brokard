
/*
// DRAWING THE DOTS
c.fillStyle = '#ffffff';
c.font = thickness + 'px arial';
c.textBaseline = "middle"
c.textAlign = "center"
//const getXFontPixel = (val) => padding + fontSize/4 + (availableWidth - fontSize/2) / (data.length - 1) * val
for(let i = 0; i < data.length; i ++) {
  c.beginPath();
  //c.fillText(data[i], getXFontPixel(i), getYPixel(data[i]) - fontSize * 2)
  c.fillStyle = '#ffffff';
  c.arc(getXPixel(i), getYPixel(data[i]), thickness, 0, Math.PI * 2, true);
  c.fill();
  c.fillStyle = '#000000';
  c.fillText(data[i], getXPixel(i), getYPixel(data[i]))
}

// // DRAWING THE SUM
c.fillStyle = '#ffffff';
c.font = fontSize*3 + 'px arial';
c.textBaseline = "middle"
c.textAlign = "center"
c.beginPath();
c.fillText("100", availableWidth/2, availableHeight/2)

const gradient = graph.value.getContext("2d").createLinearGradient(0, 0, 0, graph.value.clientHeight)
gradient.addColorStop(0, "#20d74c28");
gradient.addColorStop(1, "rgba(0,0,0,0)");
const chart = new Chart(graph.value, {
  type: 'line',
  data: {
    labels: props.history,
    datasets: [{
      data: props.history,
      fill: true,
      backgroundColor: gradient,
      borderColor: '#20d74cff',
      tension: 0.1,
      borderWidth: 20,
      borderCapStyle: "round",
      borderJoinStyle: "round",
      pointBackgroundColor: "rgba(0,0,0,0)",
      pointBorderColor: "rgba(0,0,0,0)",
    }]
  },
  options: {
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          drawBorder: false,
          display: false
        },
        ticks: {
          display: false
        }
      }
    }
  }
})

 */

/*
    const updateStocks = () => {
        stocks.forEach(stock => {
            for (let i = deck.length - 1; i >= 0; i--) {
                if (deck[i].type === stock.type) {
                    let card = deck.splice(i, 1)[0]
                    console.log(card)
                    stock.history.push(card.number)
                    break
                }
            }
        })
        socket.emit("init", stocks)
        if (deck.length > 3)
            setTimeout(updateStocks, 3000);
    }

    setTimeout(updateStocks, 3000);
    */