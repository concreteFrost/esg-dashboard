export function switchWindows(buttons,windows){
    $(document).ready(()=>{
      $(buttons[0]).toggleClass('button-nav-active')
      for(let i=1;i<windows.length;i++){
        $(windows[i]).hide()
      }
    })
    
    for(let i=0; i<buttons.length;i++){
      $(buttons[i]).click(()=>{
       $(buttons[i]).toggleClass('button-nav-active')
       const nonActiveButtons=buttons.filter(b=>b!==buttons[i])
       nonActiveButtons.forEach((b)=>$(b).removeClass('button-nav-active'))
       const filter =windows.filter(w=>w+"-btn"!==buttons[i])
       $(windows[i]).show()
       filter.forEach(f=>$(f).hide())
      })
    }
  }

