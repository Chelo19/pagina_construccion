import { useEffect } from 'react';
import '../styles/AboutUs.css';


export default function AboutUs(){

    const fetchGeoLocation = async () => {
        let url = 'https://ipinfo.io/json?token=f4a64dfc914585';
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
    }

    useEffect(() => {
        fetchGeoLocation();
    }, [])


    return(
        <div className="about_us_background">
            <div className="about_us_background_img">
            </div>
            <div className='background_display'>
                <div className='about_us_container'>
                    <div className='about_us_section'>
                        <span className='about_us_title'>Nosotros</span>
                        <span>Lorem ipsum dolor sit amet. Est repellendus soluta sit rerum eligendi eum deleniti facilis in nostrum obcaecati ea nihil blanditiis non accusamus animi. Et maxime rerum ex libero nobis et minima accusamus. At rerum nisi ab nobis quae quo voluptatem odit! Et quisquam recusandae a placeat totam At dolorum unde.
                            Et galisum quos et voluptates quia ut deleniti provident ut velit odit non voluptatum sapiente et quisquam facere. Cum praesentium atque qui beatae numquam ut expedita consequatur et alias sequi. Quo nostrum excepturi qui cupiditate possimus non sint sunt qui harum recusandae.</span>
                        <span>HOLA</span>
                    </div>
                </div>
                <div className='about_us_container_img'>
                    <img src={require('../img/blueprint.png')}/>
                </div>
            </div>
        </div>
    )
}