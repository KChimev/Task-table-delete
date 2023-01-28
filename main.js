let tableCellsData=[]
let tableRowArr=[] //ARRAY OF THE ROWS OF THE TABLE
let deleteArr=[] //ARRAY WHICH WILL HOLD THE CELLS FOR THE TASKS WE`LL DELETE
let emptyArr=[] //ARRAY USED TO EMPTY DELETE ARRAY
let deleteIDArr=[] //ARRAY WHICH WILL HOLD THE IDS TO BE DELETED
let taskTable=document.querySelector('#table_1')
let tableBody=taskTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
for(let i=0;i<tableBody.length;i++){
    tableRowArr.push(tableBody[i])
}
tableRowArr.forEach((row,index) => {
    deleteIDArr.push("")
    emptyArr.push("")
    let tableRowFirstDataCell=row.getElementsByTagName("td")[0] //THE FIRST DATA CELL OF EACH ROW
    let cellData=tableRowFirstDataCell.innerHTML //HOLDS THE DATA OF THE CELL SO CAN BE RETURNED LATER
    tableCellsData.push(cellData) // CELL DATA ARRAY
    tableRowFirstDataCell.setAttribute("data-index",index) // SETS "data-index" TO index OF THE ROW THAT CURRENT CELL IS
    tableRowFirstDataCell.addEventListener("mouseenter",addCheckboxes,{once:true}) //ADDS EVENT LISTENER
})
function addCheckboxes(event){
    // let index=event.currentTarget.getAttribute("data-index")
    event.currentTarget.removeEventListener("mouseenter",addCheckboxes)
    event.currentTarget.innerHTML=""
    let checkBox=document.createElement("input")
    checkBox.setAttribute("type","checkbox")
    checkBox.setAttribute("class","check")
    checkBox.addEventListener("change",deleteMultiple)
// checkBox.setAttribute("") //<-----  ADD STYLING TO CHECKBOXES
    event.currentTarget.appendChild(checkBox)
    event.currentTarget.addEventListener("mouseleave",removeCheckboxes,{once:true})
}
function removeCheckboxes(event) {
    deleteArr=emptyArr
    event.currentTarget.removeEventListener("mouseenter",removeCheckboxes)
    event.currentTarget.innerHTML=""
    let index=event.currentTarget.getAttribute("data-index")
    event.currentTarget.innerHTML=tableCellsData[index]
    event.currentTarget.addEventListener("mouseover",addCheckboxes,{once:true})
}
function deleteMultiple(){
    let firstCellArr=[]
    tableRowArr.forEach(row=>{
        let tableRowFirstDataCell=row.getElementsByTagName("td")[0]
        firstCellArr.push(tableRowFirstDataCell)
    })
    deleteArr=firstCellArr.map((cell)=>{
        if(cell.firstChild.tagName==="INPUT" && cell.firstChild.checked){
        return cell.firstChild.tagName}
    })
    if(deleteArr.filter(element=>element=="INPUT").length!==0){
        tableRowArr.forEach(row=>{
            let tableRowFirstDataCell=row.getElementsByTagName("td")[0]
            firstCellArr.push(tableRowFirstDataCell)
        })
        firstCellArr.forEach(cell=>{
            cell.removeEventListener("mouseleave",removeCheckboxes) 
            cell.removeEventListener("mouseenter",addCheckboxes)
            if(cell.firstChild.tagName!=="INPUT"){
                let checkBox=document.createElement("input")
                checkBox.setAttribute("type","checkbox")
                checkBox.setAttribute("class","check")
                checkBox.addEventListener("change",deleteMultiple)
                cell.innerHTML=""
                cell.appendChild(checkBox)
            }
        })
        if(document.querySelector("[data-check-all]","true")===null){
        let selectAll=document.createElement("input") //<<--CHECKBOX TO SELECT ALL
        selectAll.setAttribute("type","checkbox")
        selectAll.setAttribute("data-check-all","true")
        selectAll.addEventListener("change",(event)=>{
            if(event.currentTarget.checked){
                tableRowArr.forEach((row,index) => {
                    let rowCheckbox=row.getElementsByTagName("td")[0].firstChild 
                    rowCheckbox.checked = true
                    let tableRowFirstDataCell=row.getElementsByTagName("td")[0]
                    tableRowFirstDataCell.setAttribute("data-index",index) 
                    tableRowFirstDataCell.removeEventListener("mouseenter",addCheckboxes) 
                    // tableRowFirstDataCell.removeEventListener("mouseleave",addCheckboxes) 
                })
            }
            else if(event.currentTarget.checked!==true){
                tableRowArr.forEach((row) => {
                    let rowCheckbox=row.getElementsByTagName("td")[0].firstChild 
                    rowCheckbox.checked = false
                    deleteMultiple()
                    })
            }
        })
        document.body.appendChild(selectAll)
    }
    }
    else if (deleteArr.filter(element=>element=="INPUT").length===0){
        firstCellArr.forEach((cell,index)=>{
            cell.innerHTML=tableCellsData[index]
            cell.addEventListener("mouseenter",addCheckboxes,{once:true})
        })
        document.querySelector("[data-check-all]").remove()
    }
   deleteArr.forEach((cell,index)=>{
        if(cell==="INPUT"){
            let deleteCellArr=tableRowArr[index].getElementsByTagName("td")
            let ID=deleteCellArr[deleteCellArr.length-1].lastElementChild.getAttribute("id").split("_")[1]
            deleteIDArr[index]=ID
        }
        else if(cell!=="INPUT"){
            deleteIDArr[index]=""
        }
    })
    deleteTasks()
}
function deleteTasks(){   //<--FUNCTION USED TO SEND TASK IDS TO BE DELETED
    console.log(deleteIDArr)
}
