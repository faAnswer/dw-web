export default function box (props) {
  return (
    <span style={{ display: 'inline-block', height: props.size * 8, width: props.size * 8 }} />
  )
}