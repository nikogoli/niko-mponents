export default function SimpleSpinner(props:{
  size?: number,
  main_color?: string,
  bg_color?: string,
  with_hover?:{
    bg: string,
    target: null | string
  },
}){
  const { main_color, bg_color:bg, with_hover } = props
  const size = props.size ? `h-${props.size} w-${props.size}` : "h-10 w-10"
  const main = "border-" + (main_color ?? "sky-400")
  const hover_cls = with_hover ? `${with_hover.target ? with_hover.target+"-" : "" }hover:border-t-[${with_hover.bg}]` : ""
  const bg_cls = `border-t-[${bg ?? "inherit"}] ${hover_cls}`
  return (
    <div class="flex justify-center">
      <div class={`animate-spin ${size} border-4 ${main} rounded-full ${bg_cls}`}>
      </div>
    </div>
  )
}