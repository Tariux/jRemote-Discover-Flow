import { useEffect, useState } from "react";
import SendBidButton from "../Components/SendBidButton";
import SendToTelegramButton from "../Components/SentToTelegramButton";



function GetProjectTemplate() {

  const [Project, setProject] = useState({});
  const [ProjectID, setProjectID] = useState("");

  async function fetchProject() {

    if (!ProjectID) {
      return;
    }

    setProject({});


    
    document.getElementById('get-project-status').innerHTML = 'درحال دریافت اطلاعات پروژه...';

    const response = await fetch(`http://localhost:3030/project/get/?project_id=${encodeURIComponent(ProjectID)}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });


    const result = await response.json();

    if (result.bid) {

      document.getElementById('get-project-status').innerHTML = 'پروژه ' + ProjectID + ' یافت شد';

      setProject(result.bid);
      return result;

    } else {
      document.getElementById('get-project-status').innerHTML = 'پروژه ' + ProjectID + ' یافت نشد';

    }
  }

  function updateID() {
    setProjectID(document.getElementById('project_id_fetch').value)

  }

  const ProjectDataTemplate = (
    <>
      <label htmlFor="project_title">عنوان پروژه</label>
      <textarea id="project_title" name="project_title" defaultValue={Project.title} />

      <label htmlFor="project_desc">توضیحات پروژه</label>
      <textarea id="project_desc" name="project_desc" defaultValue={Project.desc} />

      <label htmlFor="project_data">حداقل قیمت</label>
      <input type="text" defaultValue={Project.minPrice} name="project_data" />

      <label htmlFor="project_data">حداکثر قیمت</label>
      <input type="text" defaultValue={Project.maxPrice} name="project_data" />


      <SendBidButton project_id={Project.id} />
      <SendToTelegramButton project_id={Project.id} />
    </>
  )

  return (
    <>


      <label htmlFor="project_id_fetch">کد پروژه</label>
      <input type="text" id="project_id_fetch" onKeyUp={updateID} name="project_id_fetch" />

      <p id="get-project-status" className="center">ابتدا کد پروژه را وارد کنید تا مراحل ادامه یابد </p>
      {
        (Project.title !== undefined) ? ProjectDataTemplate : <></>
      }






      <button type="submit" className="orange" onClick={fetchProject}>دریافت اطلاعات</button>





    </>
  );
}

export default GetProjectTemplate;
