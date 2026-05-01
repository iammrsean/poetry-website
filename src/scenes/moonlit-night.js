let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.7,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random(),
    delta: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bg.addColorStop(0, '#060d1a')
    bg.addColorStop(1, '#0d1b2a')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach(star => {
      star.opacity += star.delta
      if (star.opacity > 1 || star.opacity < 0.1) star.delta *= -1
      const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3)
      glow.addColorStop(0, `rgba(255,255,255,${star.opacity})`)
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2)
      ctx.fill()
    })

    const moonX = canvas.width * 0.78
    const moonY = canvas.height * 0.18
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80)
    moonGlow.addColorStop(0, 'rgba(255,250,200,0.15)')
    moonGlow.addColorStop(1, 'rgba(255,200,50,0)')
    ctx.fillStyle = moonGlow
    ctx.beginPath()
    ctx.arc(moonX, moonY, 80, 0, Math.PI * 2)
    ctx.fill()

    const moonCore = ctx.createRadialGradient(moonX - 6, moonY - 6, 0, moonX, moonY, 28)
    moonCore.addColorStop(0, '#fffde7')
    moonCore.addColorStop(0.6, '#fff9c4')
    moonCore.addColorStop(1, '#ffd54f')
    ctx.fillStyle = moonCore
    ctx.beginPath()
    ctx.arc(moonX, moonY, 28, 0, Math.PI * 2)
    ctx.fill()

    const ground = ctx.createLinearGradient(0, canvas.height * 0.85, 0, canvas.height)
    ground.addColorStop(0, '#0a1008')
    ground.addColorStop(1, '#050a04')
    ctx.fillStyle = ground
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15)

    const fx = canvas.width / 2
    const fy = canvas.height * 0.82
    ctx.fillStyle = '#030805'
    ctx.beginPath()
    ctx.arc(fx, fy - 18, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(fx - 5, fy - 10, 10, 22)

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
