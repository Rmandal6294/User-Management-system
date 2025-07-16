const getData = document.getElementById("get_data");
const submitButton = document.getElementById("top_bottom");
const viewProcess = document.getElementById("view_bottom");
const insertData = document.getElementById("insertRecord");
const viewData = document.getElementById("viewRecord");
const filterData = document.getElementById("filterRecord");
const deleteData = document.getElementById("deleteRecord");
const  displayProcess = document.getElementById("dialog_view");
const displayData = document.getElementById("main_view");



let records = [];
let filterRecord = [];
let processNotifications = [];

const renderString = str => {
    processNotifications.push(str);
    viewProcess.innerHTML = `${processNotifications.join("<br><br>")}`;
    // viewProcess.innerHTML = `<p>${processNotifications.join("\n")}</p>`;
}
renderString("🚀 Server is running .......");
renderString("✅ DataBase Connected....");



insertData.addEventListener("click", ()=> fn1());

viewData.addEventListener("click", ()=> fn2());

filterData.addEventListener("click", ()=> fn3());

deleteData.addEventListener("click", ()=> fn4());


let clickcount = 0;
const fn1 = () =>{
    clickcount++;
    
    if(clickcount === 1) {
        getData.disabled = false;
        getData.style.cursor = "pointer";

        submitButton.innerHTML = "🔓 Text area is unlocking .....";
        setTimeout(()=>{
            submitButton.innerHTML = " 🔡 Inset your data above & submit -----";
            insertData.innerHTML = "submit";

        }, 1000)
        
    } else if(clickcount === 2) {
        clickcount = 0;
        const value =getData.value.trim();
        submitInsertedData(value);
        insertData.innerHTML = "Insert Record";
        
    }
    
};


const fn2 = async () =>{
    getData.disabled = true;
    getData.style.cursor = "no-drop";

        submitButton.innerHTML = "🔒 Text area is locking .....";
        setTimeout(() => {
            submitButton.innerHTML = "✔️ Data Founded .........";
            
        }, 1000)

    try {
        displayProcess.innerHTML = '📡 Fetching all records.....';
        renderString('📡 Fetching all records.....');

        const responses = await fetch('/api/records', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json'},
        });

        if(!responses.ok){
            renderString("Error found ⚠️⚠️⚠️: \n",responses.status);
            throw new Error("Http Error: ", responses.status);
        }

        const result = await responses.json();

        if(!result.success){
            throw new Error(result.error || '⛓️‍💥 Failed to Fetch');
        }

        const data = result.data || [];

        if(data.length === 0){
            displayProcess.innerHTML = "☠️ No Data Found !!!!!!!";
            renderString("⚠️ No Data in Records....");
            submitButton.innerHTML("⚠️ Not Found! ❌")
            return;
        }
        displayProcess.innerHTML = `📌 ${data.length}  Data Found  `;
        renderString("✅ ^_^ Loading Data ^_^");
        

        let dataFormate;
        data.forEach((rec, ind)=>{
            dataFormate += `
            <ul style = " padding: 10px;
            margin: 10px;
            border-radius: 20px;
            box-shadow: 2px 2px 20px rgb(146, 143, 143);">

            <li style = "color: blue;
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"> Name : ${rec.name || "user"}</li>

            <li style = "color: rgb(74, 50, 144);
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"> Id: ${rec._id || ind + 1}</li>

                <li style = "color: rgb(126, 79, 155);
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"> Created At: ${rec.createdAt || 'N/A'}</li>

            <li style = "color: rgb(209, 123, 43);
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"><pre>${JSON.stringify(rec.data || rec, null, 2 || data)}</pre></li>

            </ul>
            `;
        });

        displayData.innerHTML = dataFormate;
        records = data;
        console.log(records);
        
    } catch (error){
        displayProcess.innerHTML = "❌❌❌ ERROR -> fetching records ❌❌❌";
        renderString("❌ Error fetching records: ", error.message);
        displayData.innerHTML = error.message;
    }
}

let clkCount = 0;
const fn3 = async () =>{
    clkCount++;
    
    if(clkCount === 1) {
        submitButton.innerHTML = "🔓 Text area is unlocking .....";
        renderString("🔓 Text area is unlocking .....");

        setTimeout(()=>{
            submitButton.innerHTML = " ⚙️ Getting your data for processing......";
            renderString("⚙️ Getting your data for processing......");
            filterData.innerHTML = "submit";

            try{
                fn2();

                setTimeout(()=>{
                    getData.disabled = false;
                    getData.style.cursor = "pointer";
                    submitButton.innerHTML = " 🔢 Enter your filter key....";
                    renderString("🔢 Enter your filter key....");
                    displayProcess.innerHTML = "👁️ See the keys and set your filter in input field.....";
                }, 1000);
                getData.setAttribute("placeholder", "Enter your key like: name");

            } catch(error){
                renderString("err2");
            }

            
        }, 1000)
        
        
    } else if(clkCount === 2) {
        clkCount = 0;
        filterData.innerHTML = "Filter Record";
        renderString("💾 Requested Accepted ......");
        displayProcess.innerHTML = "🔑 Your key is going to Filtering.....";

        try{
            if(records.length === 0){
                displayProcess.innerHTML = "⚠️ !!!!!!! No records found !!!!!!!!!⚠️";
                renderString("⚠️ Issue in finding records...........");
                return;
            }

            const filterKey = getData.value;
            console.log(filterKey);

            if(!filterKey){
                displayProcess.innerHTML = " ⚠️ No key provided to Filter...";
                submitButton.innerHTML = "⚠️ Please Enter the key to filter like : name, age....";
                renderString("🔑⚠️ .... Key not Found .....");
                return;
            }

            const filtered = records.filter(record =>{
                const recordString = JSON.stringify(record).toLowerCase();
                return recordString.includes(filterKey.toLowerCase());
            });

            if(filtered.length === 0){
                displayProcess.innerHTML = `⚠️ your key 🔑 ${filterKey} not matching.....`;
                submitButton.innerHTML = "⚠️ Try another key....";
                renderString("🔑⚠️ .... Key not matched .....");
                return;
            }

        displayProcess.innerHTML = `✅ ${filtered.length}  Data Found  `;
        renderString("✅ ^_^ Loading Data ^_^");
        submitButton.innerHTML = "✅✅ your Requested done Successfully ✅✅"
        

        let dataFormate;
        filtered.forEach((rec, ind)=>{
            dataFormate += `
            <ul style = " padding: 10px;
            margin: 10px;
            border-radius: 20px;
            box-shadow: 2px 2px 20px rgb(146, 143, 143);">

            <li style = "color: blue;
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"> Name : ${rec.name || "user"}</li>

            <li style = "color: rgb(74, 50, 144);
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"> Id: ${rec._id || ind + 1}</li>

                <li style = "color: rgb(126, 79, 155);
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"> Created At: ${rec.createdAt || 'N/A'}</li>

            <li style = "color: rgb(209, 123, 43);
            font-family: cursive;
            padding: 10px;
            margin: 0px;
            list-style-type: none;"><pre>${JSON.stringify(rec.data || rec, null, 2 || data)}</pre></li>

            </ul>
            `;
        });

        displayData.innerHTML = dataFormate;
        getData.value = "";

        } catch(error){
            renderString("❌ Error filtering records!");
            displayData.innerHTML = error.message;
            submitButton.innerHTML = "📌 Try Again.....";
            displayProcess.innerHTML = "❌❌❌ - ERROR - ❌❌❌❌";
        }
        
    }

}

let cCount = 0;
const fn4 = async() =>{
    cCount++;

    if(cCount === 1){
        submitButton.innerHTML = "📡 Your Textarea is enabling for input.....";
        renderString("📡 Your request going to submit....");

         setTimeout(() => {
            getData.disabled = false;
            getData.style.cursor = "pointer";
            deleteData.innerHTML = "Submit";
            submitButton.innerHTML = " 🔢 Enter id ( IN NUMBER ) to delete the data and SUBMIT....";
            renderString("💾 Textarea is Enabled enter your data id.....");
            displayProcess.innerHTML = "👆 Click View records for knowing id of the data ....";
            getData.setAttribute("placeholder", "ex:24366388355373");


         }, 1000);

    } else if(cCount === 2){
        cCount = 0;

        deleteData.innerHTML = "Delete Record";
        submitButton.innerHTML = " ⚙️ Processing your request ..... WAIT";
        renderString("💾 Your data is going to delete....");
        displayProcess.innerHTML = "🔃 Processing . . . . ";

          try{
                const deletingId = Number(getData.value);
                console.log(Number.isInteger(deletingId));

                if(!deletingId || NaN){
                    submitButton.innerHTML = "⚠️ ---> 🔑 Please Enter ID number to delete....";
                    displayProcess.innerHTML = "⚠️⚠️ Enter id in number ⚠️⚠️";
                    renderString("⚠️ Enter your data id (ex:53774674748)...");
                    return;
                }

                if(confirm(`☠️ Are you sure to delete your data of id ${deletingId}`)){

                    const responses = await fetch(`/api/records/${deletingId}`,{
                        method: 'DELETE',
                        headers: {'Content-Type' : 'application/json'}
                    });

                    const deleteResult = await responses.json();

                    if(!responses.ok){
                        throw new Error (deleteResult.error || `Http error! status: ${responses.status}`);
                    }

                    if(!deleteResult.success) {
                        throw new Error (deleteResult.error || `⚠️ Failed !!! To deleting data.`);
                    }

                    displayProcess.innerHTML = "✅✅ Done - The data is Deleted ✅✅";
                    submitButton.innerHTML = "🆗 Data deleted Successfully 🆗";
                    renderString("✔️........Data is deleted........✔️");
                }

            }catch(error){
                renderString("❌ Error Deleting records!");
                displayData.innerHTML = "Error :-> "+ error.message;
                submitButton.innerHTML = "📌 Try Again.....";
                displayProcess.innerHTML = "❌❌❌ - ERROR TO DELETE - ❌❌❌❌";
            }

    }
    
}

const submitInsertedData = async(value) =>{

    try {
        if(value === ""){
            submitButton.innerHTML = "⚠️ Please Insert your data then submit ⚠️";
        return;
        }
    
        if(!value || value.trim() === ""){
            displayProcess.innerHTML = "⛓️‍💥Error: no data to submit";
            return;
        }
        console.log(value);
        let parseData = extractData(value);
        console.log("....", parseData);
        // parseData = JSON.stringify(parseData);
        parseData = JSON.parse(parseData)
        console.log("___",parseData);
        let rc = JSON.stringify(parseData);
        console.log(rc);

        
        displayProcess.innerHTML = "🔃 Submitting data......";

            const responses = await fetch('/api/records', {
                method : 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: rc,
            });

            const resData = await responses.json();

            if(responses.ok) {
                displayProcess.innerHTML = "✅ Inserting Complete.";
                viewProcess.innerHTML = `<pre> ${JSON.stringify(resData, null, 2)} </pre>`;
                getData.value = " ";
                getData.disabled = true;
            } else {
                throw new Error(resData.error || '📦 server error');
            }
    } catch(error){
            displayData.innerHTML = error.message;
            displayProcess.innerHTML = "❌ Not Inserting || Problem Detected";
            
    }
}

const extractData = value =>{
    try {
        let cleanValue = value.trim();

        if(!cleanValue){
            throw new Error("please enter some data");
        }

        const objectMatch = cleanValue.match(/\{[\s\S]*\}/);

        if(!objectMatch){
            throw new Error ("📡 No value object found");
        }

        let objectSrt = objectMatch[0];

        // objectSrt = objectSrt.replace(/,\s*:/g, ':');
        objectSrt = objectSrt.replace(/,\s*\}/g, '}');
        objectSrt = objectSrt.replace(/,\s*\(/g, ')');
        objectSrt = objectSrt.replace(/\.\.\./g, '');
        objectSrt = objectSrt.replace(/,,+/g, ',');
        objectSrt = objectSrt.replace(/(\w+)\s*:/g, '"$1":');
        objectSrt = objectSrt.replace(/'/g, '"');
        objectSrt = objectSrt.replace(/:\s*([a-zA-Z] [a-zA-Z0-9\s]*[a-zA-Z0-9])\s*([,}])/g, ': "$1"$2');

        console.log(JSON.parse(objectSrt));
        
        return objectSrt;
    }catch (error){
        displayProcess.innerHTML = "⚠️ Error parsing data";
        throw error;
    }
}


document.addEventListener('DOMContentLoaded', ()=>{
   displayProcess.innerHTML = "📖 Application is ready!";
})