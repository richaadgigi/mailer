"use client"
import React from 'react'

const Buymeacoffee = () => {
    React.useEffect(() => {
        const script = document.createElement('script')
        script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
        script.setAttribute("data-name", "BMC-Widget");
        script.setAttribute("data-cfasync", "false");
        script.setAttribute("data-id", "xnyderhq");
        script.setAttribute("data-description", "Support me on Buy me a coffee!");
        script.setAttribute("data-message", "");
        script.setAttribute("data-color", "#5F7FFF");
        script.setAttribute("data-position", "Right");
        script.setAttribute("data-x_margin", "18");
        script.setAttribute("data-y_margin", "18");
        script.async = true
        document.body.appendChild(script)
        console.log("Buy Me a Coffee component mounted");
        script.onload = () => console.log("Buy Me a Coffee widget loaded successfully");


        return () => {
            // document.body.removeChild(script)
        }
    }, [])
  return (
    <>
      
    </>
  )
}

export default Buymeacoffee
