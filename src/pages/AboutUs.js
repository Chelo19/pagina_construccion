import { useEffect } from 'react';
import '../styles/AboutUs.css';


export default function AboutUs(){

    const fetchGeoLocation = async () => {
        let url = 'https://ipinfo.io/json?token=f4a64dfc914585';
        let response = await fetch(url);
        let data = await response.json();
        //console.log(data);
    }

    const getJsonData = async () => {
        let data = require('../assets/country-states-data.json');
        console.log(data);
    }

    useEffect(() => {
        fetchGeoLocation();
        getJsonData();
    }, [])


    return(
        <div className="about_us_background">
            <div className='about_us_container' id='about_us_first'>
                <div className='about_us_section'>
                    <span className='about_us_title'>¿Qué es <span className='orange_span'>DREC</span>?</span>
                    <span>DREC es el primer <span className='orange_span'>marketplace</span> enfocado 100% en la construcción<span className='orange_span'>.</span> Dando el acercamiento a personas con deseo de obtener un proyecto de construcción y empresas especializadas en el área<span className='orange_span'>.</span></span>
                    <span>DREC no solo une a personas con empresas, DREC también mantiene un vinculo a través de una buena <span className='orange_span'>supervisión</span>, dando <span className='orange_span'>garantía</span> de que todo servicio se realice en tiempo y forma<span className='orange_span'>.</span></span>
                    <span>Todos los servicios se realizan bajo la marca DREC, dando <span className='orange_span'>seguridad</span> a los clientes y empresas que nosotros daremos seguimiento desde el inicio del proyecto hasta que finalice. Por lo tanto, damos <span className='orange_span'>certeza</span> de cada uno de los servicio y <span className='orange_span'>garantizamos</span> los pagos a cada una de las empresas<span className='orange_span'>.</span></span>
                    <span>Nosotros <span className='orange_span'>D</span>emolemos, <span className='orange_span'>R</span>emodelamos, <span className='orange_span'>E</span>dificamos y <span className='orange_span'>C</span>onstruimos tus proyectos, nosotros somos <span className='orange_span'>DREC.</span></span>
                </div>
                <div className='about_us_container_img' id='about_us_first_img'>
                    <img src={require('../img/myservices.png')}/>
                </div>
            </div>
            <div className='about_us_container' id='about_us_second'>
                <div className='about_us_section'>
                    <span className='about_us_title'>Misión</span>
                    <span>Hacer que la construcción sea un medio <span className='orange_span'>accesible</span> para todos y de gran <span className='orange_span'>calidad</span><span className='orange_span'>.</span></span>
                    <span>Logrando que cualquier persona tenga un inmueble digno y las empresas de construcción obtengan un mayor alcance<span className='orange_span'>.</span></span>
                </div>
                <div className='about_us_container_img' id='about_us_second_img'>
                    <img src={require('../img/cumplimiento.png')}/>
                </div>
            </div>
            <div className='about_us_container' id='about_us_third'>
                <div className='about_us_section'>
                    <span className='about_us_title'>Visión</span>
                    <span><span className='orange_span'>Erradicar</span> el mal desempeño de la construcción, evitar las estafas, así como la mala calidad en materiales y procedimientos<span className='orange_span'>.</span></span>
                    <span>Lograr que las personas sientan <span className='orange_span'>seguridad</span> al momento de desarrollar un proyecto de construcción<span className='orange_span'>.</span></span>
                </div>
                <div className='about_us_container_img' id='about_us_second_img'>
                    <img src={require('../img/certificate.png')}/>
                </div>
            </div>
            <div className='about_us_container' id='about_us_second'>
                <div className='about_us_section'>
                    <span className='about_us_title'>¿Cómo lo vamos a lograr?</span>
                    <span>Garantizamos la <span className='orange_span'>calidad</span> de los servicios a través de una gran supervisión, capacitando a cada uno de nuestros supervisores y asesores<span className='orange_span'>.</span></span>
                    <span>Evaluando a las empresas que forman parte de nuestra plataforma y dando de baja a las empresas que no cumplen con los <span className='orange_span'>estándares de calidad</span><span className='orange_span'>.</span></span>
                    <span>Lograremos la accesibilidad a través de la plataforma, evitando buscar constructores a través de referidos o buscando en métodos no confiables<span className='orange_span'>.</span></span>
                    <span>Llevaremos la accesibilidad a través de <span className='orange_span'>financiamiento</span> para cada uno de los proyectos simpre y cuando cumplan con los requerimientos<span className='orange_span'>.</span></span>
                    <span>Cada día buscamos acercar el financiamiento a todas la personas a través de distintos métodos buscando la <span className='orange_span'>accesibilidad</span> sin poner grandes barreras<span className='orange_span'>.</span></span>
                </div>
                <div className='about_us_container_img'>
                    <img src={require('../img/contrato.png')}/>
                </div>
            </div>
        </div>
    )
}