import '../styles/Spinner.css'

function Spinner({ size = 'medium', color = '#474bff' }) {
  const sizeClass = `spinner-${size}`
  
  return (
    <div className={`spinner ${sizeClass}`} style={{ '--spinner-color': color }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Spinner

