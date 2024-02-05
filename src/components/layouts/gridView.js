import * as React from 'react'

const ResponsiveAppBar = React.forwardRef(({ children, setDraggable, title, id }, ref) => {
  return (
    <div className='grid-content' ref={ref}>
      <div className='grid-title' id={id} onMouseEnter={() => setDraggable(true)} onMouseLeave={() => setDraggable(false)}>{title}</div>
      {children}
    </div>
  )
})
export default ResponsiveAppBar
