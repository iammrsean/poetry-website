let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  let waveOffset = 0

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5)
    sky.addColorStop(0, '#b3d9f5')
    sky.addColorStop(1, '#7ec8e3')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5)

    const mountains = [
      { points: [[0, 0.55], [0.2, 0.3], [0.4, 0.55]], color: 'rgba(30,60,90,0.5)' },
      { points: [[0.25, 0.55], [0.5, 0.22], [0.75, 0.55]], color: 'rgba(20,50,80,0.6)' },
      { points: [[0.55, 0.55], [0.78, 0.32], [1, 0.55]], color: 'rgba(30,60,90,0.5)' },
    ]
    mountains.forEach(({ points, color }) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(points[0][0] * canvas.width, points[0][1] * canvas.height)
      points.forEach(([x, y]) => ctx.lineTo(x * canvas.width, y * canvas.height))
      ctx.lineTo(canvas.width, canvas.height * 0.56)
      ctx.lineTo(0, canvas.height * 0.56)
      ctx.fill()
    })

    const river = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height)
    river.addColorStop(0, '#3a8fc4')
    river.addColorStop(1, '#1565c0')
    ctx.fillStyle = river
    ctx.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45)

    waveOffset += 0.5
    for (let i = 0; i < 5; i++) {
      const y = canvas.height * 0.6 + i * 18
      ctx.strokeStyle = `rgba(255,255,255,${0.08 - i * 0.01})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 4) {
        const waveY = y + Math.sin((x + waveOffset + i * 30) * 0.03) * 4
        if (x === 0) ctx.moveTo(x, waveY)
        else ctx.lineTo(x, waveY)
      }
      ctx.stroke()
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
