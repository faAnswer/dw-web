const progressBar = (props) => {
  const { bgcolor, completed } = props

  const containerStyles = {
    height: 46,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  )
}

export default progressBar
