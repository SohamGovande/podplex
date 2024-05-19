export default function MainPage() {
  useEffect(() => {
    const gradient = new Gradient()
    // @ts-ignore
    gradient.initGradient('#gradient-canvas')
  }, [])

  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: -2 }}>
        <canvas ref={canvasRef} id='gradient-canvas' />
      </div>
    </>
  )
}
