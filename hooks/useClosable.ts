import { render, createElement, VNode } from "preact"

export default function useClosable(props:{
  rootID: string,
  opacity: number,
  innerElem?: VNode,
  position?: {x:number, y:number, corner?:"tl"|"tr"|"bl"|"br"},
  not_center?: true,
  z_value?: number,
  on_settle?: () => void,
  dev?: true,
}):[
  Set:()=>[outer:HTMLElement, inner:HTMLElement|null], Settle:()=>void,
]{
  const baseZ = props.z_value ?? 10

  function Settle(){
    const top_elem = document.getElementById(props.rootID)
    const temp_elem = document.getElementById("temp")
    if (top_elem && temp_elem){
      if (props.dev){ console.log("useClosable: delete container") }
      top_elem.removeChild(temp_elem)
    }
    if (props.on_settle){ props.on_settle() }
  }

  function Set():[outer:HTMLElement, inner:HTMLElement|null]{
    const elem = createElement(
      "div",
      {id: "temp", style: {
        position: "fixed", width: "100%", height: "100%", top: "0", left: "0", zIndex: String(baseZ),
      }}
    )
    const top_elem = document.getElementById(props.rootID)!
    const container = document.createElement("div")
    render(elem, container)
    const outer = container.firstElementChild! as HTMLElement
    
    if (props.innerElem){
      outer.style.display = "grid"
      if (!props.not_center){
        outer.style.placeContent = "center"
      }
      let container = document.createElement("div")
      render(props.innerElem, container)
      const inner = container.firstElementChild! as HTMLElement
      inner.style.zIndex = String(baseZ+5)
      outer.appendChild(inner)
      container = document.createElement("div")
      const backdp = createElement(
        "div", {style: {
          position: "absolute", width: "100%", height: "100%", top: "0", left: "0", zIndex: String(baseZ+1),
          background: `rgba(0, 0, 0, ${props.opacity/100})`
        }}
      )
      render(backdp, container)
      const dp = container.firstElementChild!
      dp.addEventListener("click", Settle)
      outer.appendChild(dp)
      top_elem.appendChild(outer)

      if (props.position){
        outer.style.display = "block"
        const { corner, x, y } = props.position
        const posi_x = corner?.includes("r") ? x -Number(inner.clientWidth) : x
        const posi_y = corner?.includes("b") ? y -Number(inner.clientHeight) : y
        inner.style.left = String(posi_x)
        inner.style.top = String(posi_y)
      }
      if (props.dev){ console.log("useClosable: mount container") }
      return [outer, inner]
    }
    else {
      outer.style.background = `rgba(0, 0, 0, ${props.opacity/100})`
      outer.addEventListener("click", Settle)
      top_elem.appendChild(outer)
      if (props.dev){ console.log("useClosable: mount container") }
      return [outer, null]
    }
  }
  return [Set, Settle]
}