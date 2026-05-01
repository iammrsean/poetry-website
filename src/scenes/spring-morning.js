let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const petals = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 1 + 0.5,
    speedX: Math.random() * 0.8 - 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
    opacity: Math.random() * 0.6 + 0.4,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
    sky.addColorStop(0, '#c8e6f5')
    sky.addColorStop(0.6, '#e8f5e9')
    sky.addColorStop(1, '#a5d6a7')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const sunX = canvas.width * 0.75
    const sunY = canvas.height * 0.15
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 100)
    sunGlow.addColorStop(0, 'rgba(255,250,200,0.6)')
    sunGlow.addColorStop(1, 'rgba(255,230,100,0)')
    ctx.fillStyle = sunGlow
    ctx.beginPath()
    ctx.arc(sunX, sunY, 100, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#fff9c4'
    ctx.beginPath()
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2)
    ctx.fill()

    const ground = ctx.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height)
    ground.addColorStop(0, '#81c784')
    ground.addColorStop(1, '#4caf50')
    ctx.fillStyle = ground
    ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18)

    petals.forEach(petal => {
      petal.y += petal.speedY
      petal.x += petal.speedX
      petal.rotation += petal.rotationSpeed
      if (petal.y > canvas.height + 10) {
        petal.y = -10
        petal.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate(petal.rotation)
      ctx.globalAlpha = petal.opacity
      ctx.fillStyle = '#f48fb1'
      ctx.beginPath()
      ctx.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2)
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
