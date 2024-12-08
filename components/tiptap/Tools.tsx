import { AlignCenter, AlignLeft, AlignRight, Bold, Code, Image, Italic, Quote, Strikethrough, Underline } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { Editor } from '@tiptap/react'
import { ListBulleted, ListNumbered } from '@carbon/icons-react'

const tools = [
    {
        task: 'bold',
        icon: <Bold size={12}/>
    },
    {
        task: 'italic',
        icon: <Italic/>
    },
    {
        task: 'underline',
        icon: <Underline/>
    },
    {
        task: 'strikethrough',
        icon: <Strikethrough/>
    },
    {
        task: 'code',
        icon: <Code/>
    },
    {
        task: 'left',
        icon: <AlignLeft/>
    },
    {
        task: 'center',
        icon: <AlignCenter/>
    },
    {
        task: 'quote',
        icon: <Quote/>
    },
    {
        task: 'right',
        icon: <AlignRight/>
    },
    {
        task: 'bulletlist',
        icon: <ListBulleted/>
    },
    {
        task: 'orderedlist',
        icon: <ListNumbered/>
    },
    {
        task: 'image',
        icon: <Image/>
    },
] as const

interface Props{
    editor: Editor | null
} 
type TaskType = (typeof tools)[number]['task']
const Tools = ({editor}: Props) => {
    const handleClick = (task: TaskType) => {
        switch(task){
            case "bold":
                return editor?.chain().focus().toggleBold().run()
            case "italic":
                return editor?.chain().focus().toggleItalic().run()
            case "strikethrough":
                return editor?.chain().focus().toggleStrike().run()
            case "code":
                return editor?.chain().focus().toggleCode().run()
            case "orderedlist":
                return editor?.chain().focus().toggleOrderedList().run()
            case "bulletlist":
                return editor?.chain().focus().toggleBulletList().run()
            case "quote":
                return editor?.chain().focus().toggleBlockquote().run()
            // case "center":
                //  return editor?.chain().focus().toggle().run()

        }
    }
  return (
    <div>
        {tools.map((item) => {
            return(
                <Button type='button' key={item.task} onClick={()=> handleClick(item.task)} className={`${editor?.isActive(item.task) || editor?.isActive({textAlign: item.task}) ? "bg-black text-white" : "bg-white text-balance text-black hover:text-white" } mx-1 w-10 h-10`}>
                    {item.icon}
                </Button>
            )
        })}
      
    </div>
  )
}

export default Tools
