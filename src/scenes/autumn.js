let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const leafColors = ['#e65100', '#bf360c', '#f57f17', '#ff8f00', '#d84315']
  const leaves = Array.from({ length: 35 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 10 + 6,
    speedY: Math.random() * 1.2 + 0.4,
    speedX: Math.random() * 1.2 - 0.6,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.06,
    color: leafColors[Math.floor(Math.random() * leafColors.length)],
    opacity: Math.random() * 0.5 + 0.5,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
    sky.addColorStop(0, '#bf8040')
    sky.addColorStop(0.5, '#d4903a')
    sky.addColorStop(1, '#8b4513')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#4a2510'
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15)

    ctx.strokeStyle = 'rgba(40,20,5,0.8)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.85, 0)
    ctx.quadraticCurveTo(canvas.width * 0.8, canvas.height * 0.3, canvas.width * 0.7, canvas.height * 0.45)
    ctx.stroke()
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.78, canvas.height * 0.2)
    ctx.quadraticCurveTo(canvas.width * 0.65, canvas.height * 0.25, canvas.width * 0.6, canvas.height * 0.35)
    ctx.stroke()

    leaves.forEach(leaf => {
      leaf.y += leaf.speedY
      leaf.x += leaf.speedX + Math.sin(leaf.y * 0.02) * 0.5
      leaf.rotation += leaf.rotationSpeed
      if (leaf.y > canvas.height + 10) {
        leaf.y = -10
        leaf.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.rotation)
      ctx.globalAlpha = leaf.opacity
      ctx.fillStyle = leaf.color
      ctx.beginPath()
      ctx.ellipse(0, 0, leaf.size, leaf.size * 0.55, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    ctx.globalAlpha = 1
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
