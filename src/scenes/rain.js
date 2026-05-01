let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const drops = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 15 + 8,
    speed: Math.random() * 4 + 3,
    opacity: Math.random() * 0.3 + 0.1,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
    sky.addColorStop(0, '#546e7a')
    sky.addColorStop(0.6, '#78909c')
    sky.addColorStop(1, '#90a4ae')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const ground = ctx.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height)
    ground.addColorStop(0, '#3e5258')
    ground.addColorStop(1, '#263238')
    ctx.fillStyle = ground
    ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18)

    const px = canvas.width / 2
    const py = canvas.height * 0.72
    ctx.fillStyle = 'rgba(20,35,42,0.85)'
    ctx.beginPath()
    ctx.moveTo(px - 50, py)
    ctx.lineTo(px, py - 28)
    ctx.lineTo(px + 50, py)
    ctx.fill()
    ctx.fillRect(px - 4, py, 8, 30)

    drops.forEach(drop => {
      drop.y += drop.speed
      drop.x += drop.speed * 0.12
      if (drop.y > canvas.height) {
        drop.y = -drop.length
        drop.x = Math.random() * canvas.width
      }

      ctx.strokeStyle = `rgba(200,230,255,${drop.opacity})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(drop.x, drop.y)
      ctx.lineTo(drop.x + drop.length * 0.12, drop.y + drop.length)
      ctx.stroke()
    })

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
