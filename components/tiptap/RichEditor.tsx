
import { EditorContent, EditorProvider, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import Tools from './Tools'
import Placeholder from '@tiptap/extension-placeholder'
// import './css/styles.css'

const RichEditor = () => {
    const extensions= [StarterKit,
        Placeholder.configure({
            placeholder: "Write something..."
        })
    ]
    const editor = useEditor({
        extensions,
        editorProps:{
            attributes:{
                class: `prose prose-lg border p-2 mt-1 dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            }
        }
    })
  return (
    <div>
        <Tools editor={editor}/>
        <EditorContent editor={editor}/>
        {/* <EditorProvider extensions={[StarterKit]} content={`<h1>How are you</h1>`}/> */}
      
    </div>
  )
}

export default RichEditor
