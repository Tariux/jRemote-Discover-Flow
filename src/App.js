import './App.css';
import AppConfig from './Dashboard/AppConfig';
import GetProjectTemplate from './Dashboard/GetProject';
import getProjectTemplate from './Dashboard/GetProject';
import SerachProjectTemplate from './Dashboard/SearchProject';


function App() {


  return (
    <div className='container'>
      <div className="row fields">

      <div className='fieldset col-sm-8 col-lg-8'>
          <SerachProjectTemplate />
        </div>

        <div className='fieldset col-sm-4 col-lg-4'>

          <GetProjectTemplate />
        </div>


      </div>


    </div>
  );
}

export default App;
