import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { formatUrl } from '../router/config';

const NotFoundPage = () => {

  return (
    <div className="bg-[#f1f2f3]" >
    <div className="mx-auto text-center error-container">
      <div className="h-[30px] bg-[#f1f2f3]"></div>
      <div className="bg-white" >
        <img src={formatUrl("/asserts/very_sorry.png")} className="mx-auto" alt="Not Found" />
        <div className="py-0" style={{padding: "0 0 40px 0"}}>
          <Link to="/" 
            className="rollback-btn font-bold"
          >
            返回到首页
          </Link>
        </div>

        <div className="error-split" id="up"></div>

        <div className='error-manga'>
          <img src={formatUrl("/asserts/HtPXYfpuXU.png")} className="mx-auto" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFoundPage;