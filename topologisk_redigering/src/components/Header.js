import AddIcon from '@mui/icons-material/AddCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import BuildIcon from '@mui/icons-material/Build';
import { useState } from 'react'
import Button from './Button'

function Header({currentTool, setCurrentTool}) {

   function setStatus(tool) {
    if (tool === currentTool){
      setCurrentTool("None")
    }else {
      setCurrentTool(tool)
    }
  } 

    return (
    <>
      { <nav>
        <Button icon={<AddIcon fontSize={currentTool==="Add" ? "large" : "small"} color={currentTool==="Add" ? "success" : ""}/>} label={"Add"} 
                onClick={() => {setStatus("Add")}}/>
        <Button icon={<DeleteOutlineIcon fontSize={currentTool==="Delete" ? "large" : "small"} color={currentTool==="Delete" ? "success" : ""}/>} label={"Delete most recent polygon"}
                onClick={() => {setStatus("Delete")}}/>
        <Button icon={<ModeEditIcon fontSize={currentTool==="Edit" ? "large" : "small"} color={currentTool==="Edit" ? "success" : ""}/>} label={"Edit"} 
                onClick={() => {setStatus("Edit")}}/>
        <Button icon={<UploadFileIcon fontSize={currentTool==="Import" ? "large" : "small"} color={currentTool==="Import" ? "success" : ""}/>}
                label={"Import File"} onClick={() => {setStatus("Import")}}/>
        <Button icon={<ZoomInMapIcon fontSize={currentTool==="Zoom" ? "large" : "small"} color={currentTool==="Zoom" ? "success" : ""}/>}
               label={"Zoom to most recent polygon"} onClick={() => {setStatus("Zoom")}}/>
        <Button icon={<BuildIcon fontSize={currentTool==="Etc" ? "large" : "small"} color={currentTool==="Etc" ? "success" : ""}/>}
               label={"Debug print"} onClick={() => {setStatus("Etc")}}/>   
        <Button icon={<BuildIcon fontSize={currentTool==="Save" ? "large" : "small"} color={currentTool==="Save" ? "success" : ""}/>}
               label={"Save to cloud!"} onClick={() => {setStatus("Save")}}/>      
        <Button icon={<BuildIcon fontSize={currentTool==="AppVariableImport" ? "large" : "small"} color={currentTool==="AppVariableImport" ? "success" : ""}/>}
        label={"Import geoJson state from App.js!"} onClick={() => {setStatus("AppVariableImport")}}/>                       
      </nav> }
    </>)

}

export default Header;
