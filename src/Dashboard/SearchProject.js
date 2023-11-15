import { useEffect, useState } from "react";
import SendBidButton from "../Components/SendBidButton";
import SendToTelegramButton from "../Components/SentToTelegramButton";


function SerachProjectTemplate() {

  const [Projects, setProjects] = useState(false);

  const [Keyword, setKeyword] = useState('');
  const [Skill, setSkill] = useState('');
  const [Scale, setScale] = useState('');



  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function searchProject() {

    document.getElementById('search-projects-status').innerHTML = 'در حال جستجو پروژه های جدید...';
    setProjects(false);
    updateSearchForm();

    const response = await fetch(`http://localhost:3030/project/search/?keyword=${encodeURIComponent(Keyword)}
    &skills=${encodeURIComponent(Skill)}
    &budget=${encodeURIComponent(Scale)}
    `
      , {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });


    const result = await response.json();

    if (result.bid !== false && result.bid) {
      document.getElementById('search-projects-status').innerHTML = result.bid.length + ' پروژه جدید یافت شد';

      setProjects(result.bid);
      return result;

    }
  }



  function updateSearchForm() {
    setKeyword(document.getElementById('project-keyword').value)
    setSkill(document.getElementById('project-skills').value)
    setScale(document.getElementById('project-scale').value)

  }




  const ProjectsTemplate = (Projects === false) ? <></> : Projects.map(project =>
    <>

      <div className="project">
        <h3 className="title">
          {project.title}
        </h3>
        <p className="desc">
          <a href={project.url}>{project.url}</a>
          <br />
        </p>
        <div className="row meta">
          <div className="col-6">
            قیمت: {project.price} تومان
          </div>
          <div id={"project_" + project.id} className="col-6">
            کد پروژه: {project.id}
          </div>


          <div className="col-6">

            <SendToTelegramButton project_id={project.id} />
          </div>
          <div className="col-6">
            <SendBidButton project_id={project.id} />
          </div>

        </div>

      </div>



    </>
  )




  return (
    <>

      <div className="row">

        <div className="col-6">
          <label htmlFor="project-keyword">عنوان پروژه</label>
          <input type="text" id="project-keyword" name="project-keyword" defaultValue='' />

        </div>
        <div className="col-6">
          <label htmlFor="project-skills">تخصص ها</label>
          <input type="text" id="project-skills" name="project-skills" placeholder="مثل: php,photoshop,..." />

        </div>

        <div className="col-6">
          <label htmlFor="project-scale">بزرگی پروژه</label>
          <select name="project-scale" id="project-scale">
            <option value="">همه</option>
            <option value="1">کوچک ( از 100,000 تومان تا 300,000 تومان )</option>
            <option value="2">متوسط ( از 300,000 تومان تا 750,000 تومان )</option>
            <option value="3">خیلی کوچک ( از 5,000 تومان تا 100,000 تومان )</option>
            <option value="4">بزرگ ( از 750,000 تومان تا 5,000,000 تومان )</option>
            <option value="5">بزرگ ( از 5,000,000 تومان تا 15,000,000 تومان )</option>
            <option value="6">خیلی بزرگ ( از 15,000,000 تومان تا 50,000,000 تومان )</option>
          </select>



        </div>




        <div className="col-6">
        <label >جستجو</label>

          <button type="submit" className="green" onClick={searchProject} onMouseEnter={updateSearchForm}>جستجو پروژه</button>

        </div>


      </div>



      <div className="search-result" id="search-result" >
        <p id="search-projects-status" className="center">پروژه ای یافت نشد</p>

        {ProjectsTemplate}
      </div>

    </>
  );
}

export default SerachProjectTemplate;
