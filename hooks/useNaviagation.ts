import { useEffect } from "preact/hooks"
import { NavigationEvent } from "./navigation_api.d.ts"


export default function useNavigation(
  handler_func: (ev:NavigationEvent) => Promise<undefined>
){
  useEffect(() => {
    const navi = window.navigation
    ?  window.navigation
    : {addEventListener: (_name:string, _lisner: (ev:NavigationEvent) => void)=> {}}

    navi.addEventListener('navigate', ev => {
      if (
        !ev.canIntercept || ev.hashChange ||
        ev.downloadRequest || ev.formData
      ){
          return
      }
      const handler = () => handler_func(ev as NavigationEvent)
      ev.intercept({ handler })
      console.log(ev)
    })
  }, [])
}