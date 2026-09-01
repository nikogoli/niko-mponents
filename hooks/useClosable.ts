import { render, createElement, VNode } from "preact"



export default function useClosable(props:{
  rootID: string,
  opacity: number,
  innerElem?: VNode,
  position?: {x:number, y:number, corner?:"tl"|"tr"|"bl"|"br"},
  not_center?: true,
  z_value?: number,
  dev?: true,
}):[
  Set:()=>[outer:HTMLElement, inner:HTMLElement|null], Settle:()=>void,
]{
  const { rootID, opacity, innerElem, position, not_center, z_value, dev } = props
  const baseZ = z_value ?? 10

  function Settle(){
    const top_elem = document.getElementById(rootID)
    const temp_elem = document.getElementById("temp")
    if (top_elem && temp_elem){
      if (dev){ console.log("useClosable: delete container") }
      top_elem.removeChild(temp_elem)
    }
  }


  function Set():[outer:HTMLElement, inner:HTMLElement|null]{
    const elem = createElement(
      "div",
      {id: "temp", style: {
        position: "fixed", width: "100%", height: "100%", top: "0", left: "0", zIndex: String(baseZ),
      }}
    )
    const top_elem = document.getElementById(rootID)!
    const container = document.createElement("div")
    render(elem, container)
    const outer = container.firstElementChild! as HTMLElement
    
    if (innerElem){
      outer.style.display = "grid"
      if (!not_center){
        outer.style.placeContent = "center"
      }

      let container = document.createElement("div")
      render(innerElem, container)
      const inner = container.firstElementChild! as HTMLElement
      inner.style.zIndex = String(baseZ+5)
      outer.appendChild(inner)

      container = document.createElement("div")
      const backdp = createElement(
        "div", {style: {
          position: "absolute", width: "100%", height: "100%", top: "0", left: "0", zIndex: String(baseZ+1),
          background: `rgba(0, 0, 0, ${opacity/100})`
        }}
      )
      render(backdp, container)
      const dp = container.firstElementChild!
      dp.addEventListener("click", Settle)
      outer.appendChild(dp)
      top_elem.appendChild(outer)

      if (position){
        outer.style.display = "block"
        const { corner, x, y } = position
        const posi_x = corner
          ? foldWidthOverflow(inner, outer, x, corner.includes("r") ? "toLeft" : "toRight" )
          : x
        const posi_y = corner
          ? foldHeightOverflow(inner, outer, y, corner.includes("b") ? "toTop" : "toBottom" )
          : y
        inner.style.left = String(posi_x)
        inner.style.top = String(posi_y)
      }
      if (dev){ console.log("useClosable: mount container") }
      return [outer, inner]
    }
    else {
      outer.style.background = `rgba(0, 0, 0, ${opacity/100})`
      outer.addEventListener("click", Settle)
      top_elem.appendChild(outer)
      if (dev){ console.log("useClosable: mount container") }
      return [outer, null]
    }
  }
  return [Set, Settle]
}


// ----------- Util -----------------------------------------

function foldWidthOverflow(
  self: HTMLElement,
  container: HTMLElement,
  basePosi: number,
  dir: "toLeft" | "toRight"
){
  if (dir == "toRight"){
    return basePosi + self.clientWidth <= container.clientWidth
      ? basePosi
      : container.clientWidth - self.clientWidth
  }
  else {
    return basePosi - self.clientWidth >= 0
      ? basePosi
      : 0
  }
}


function foldHeightOverflow(
  self: HTMLElement,
  container: HTMLElement,
  basePosi: number,
  dir: "toBottom" | "toTop"
){
  if (dir == "toBottom"){
    return basePosi + self.clientHeight <= container.clientHeight
      ? basePosi
      : container.clientHeight - self.clientHeight
  }
  else {
    return basePosi - self.clientHeight >= 0
      ? basePosi
      : 0
  }
}