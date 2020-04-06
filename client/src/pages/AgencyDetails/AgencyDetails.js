import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {NavLink,  Link} from 'react-router-dom' 
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner'
import ErrorModal from '../../shared/components/UI/ErrorModal'
import { IconContext } from 'react-icons';
import { GoLocation } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import {IoIosStarOutline, IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'
import { MdPeopleOutline, MdAccessTime } from 'react-icons/md';
import { FaLevelUpAlt, FaSortNumericUp } from 'react-icons/fa';
import Button from '../../shared/components/Button/Button'
import './AgencyDetails.css'
import TourItem from '../../components/TourItem/TourItem'

const AgencyDetails = (props) => {
	const [agency, setAgency] = useState()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const [page, setPage] = useState(1);
	const [resPerPage, setResPerPage] = useState(3)
	const {agencyId} = props.match.params;

  useEffect(() => {
  	const getAgency = async () => {
  		try{
  			setLoading(true)
		  	const res = await axios.get(`/api/v1/agencies/${agencyId}`)
		  	setAgency(res.data.data)
		  	setLoading(false)
  		} catch(err) {
  			setLoading(false)
  			setError(err.response.data.message)
  		} 
  	}

  	getAgency()
  }, []);


  const {location} = props;

  useEffect(() => {
  	setPage(props.location.search.split('=')[1])
 
  }, [location])

  if (!agency) return <LoadingSpinner asOverlay/>

  	let pageContent = [];
  	for (let i = 1; i <= Math.round(agency.tours.length / resPerPage) + 1; i++) {
      if (i === 1) {
        pageContent.push(
              (<div className='span__center'>
            <span className='span__center'>
             <IconContext.Provider
            value={{ className: 'icon__green tour__info--icon full star' }}
          >
            <IoIosArrowBack />
          </IconContext.Provider>
            </span><Link className={`page__number ${location}===${i} ? active : ''`}  to={`${props.match.url}?page=${i}`}>{i}</Link>
              </div>
              )
      )
      } else if (i ===  Math.round(agency.tours.length / resPerPage) + 1) {
        pageContent.push(
        (<div className='span__center'>
          <Link  className={`page__number ${location}===${i} ? active : ''`} to={`${props.match.url}?page=${i}`}>{i}</Link>
            <span className='span__center'>
             <IconContext.Provider
            value={{ className: 'icon__green tour__info--icon full star' }}>
            <IoIosArrowForward/>
          </IconContext.Provider>
            </span>
        </div>)
      )
      } else {
        pageContent.push(
              (<div >
            <Link className={`page__number ${location}===${i} ? active : ''` }to={`${props.match.url}?page=${i}`}>{i}</Link>
              </div>
              )
      )
      }
  		
  	}  

  	const start = (page - 1) * resPerPage;	
  	const end = page * resPerPage;

 
  	
  return  <>
  {error && <ErrorModal show onClear={() => setError(false)}>{error}</ErrorModal>}
  	<div className='agency__details--container'>
  		<div className='agency__details--info'>
  		<div className='agency__name'>
  		<h1>AGENCY: {agency.name.toUpperCase()} 
  		</h1>
  		<span>
  				<img src={`http://localhost:5000/public/img/agencies/${agency.image}`}/>
  		</span>
  			<h1>CATEGORY: {agency.category.toUpperCase()}</h1>
  			</div>
  		<div className='inline__info'>

  			<h1 className='total__tours'><p>Total Tours</p><p>{agency.tours.length}</p></h1>
  			<h1 className='total__tours'><p>BOOKED BY</p><p>{agency.numOptionsBought}</p></h1>
  			<h1 className='total__tours'><p>RATING: </p><p>{agency.ratingsAverage.toFixed(2)}</p></h1>
  			<h1 className='total__tours'><p>TOURS WITHOUT REVIEW</p><p>{agency.tours.length - agency.numOptions}</p></h1>
  			</div>

  			<div className='agency__about--info'> 
  			<h1>ABOUT US</h1>
  				<p>{agency.description}</p>
  			</div>
  		</div>
  		<div className='agency__tours'>
  			<h1>TOURS</h1>
  			<div className='agency__tour--item'>{agency.tours.slice(start, end).map(tour => <TourItem tour={tour}/>)}</div>
  					<div className='pages__content'>{pageContent.map(p => p)}</div>
  		</div>

  	</div>
  </>
};

export default AgencyDetails;
