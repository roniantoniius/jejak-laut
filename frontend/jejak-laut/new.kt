import React,{ useState }  from 'react';
import './App.css';

function App() {
  const [filebase64,setFileBase64] = useState<string>("")

  function formSubmit(e: any) {
    e.preventDefault();
    // Submit your form with the filebase64 as 
    // one of your fields
    console.log({filebase64})
    alert("here you'd submit the form using\n the filebase64 like any other field")
  }

  // The Magic all happens here.
  function convertFile(files: FileList|null) {
    if (files) {
      const fileRef = files[0] || ""
      const fileType: string= fileRef.type || ""
      console.log("This file upload is of type:",fileType)
      const reader = new FileReader()
      reader.readAsBinaryString(fileRef)
      reader.onload=(ev: any) => {
        // convert it to base64
        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        Choose an image to to upload
        <form onSubmit={formSubmit}>
          <input type="file" onChange={(e)=> convertFile(e.target.files)} />
          <hr />
          { filebase64 &&
            <>
            <p>It's ready to be submitted!. Simply include the 'filebase64' variable</p>
            
          
            {/* if it's an image */ }
            {(filebase64.indexOf("image/") > -1) && 
            <img src={filebase64} width={300} />
            }    
            <hr />
            <button> Submit and check the console</button>
            
            </>
          }
        </form>
      </header>
    </div>
  );
}

export default App;