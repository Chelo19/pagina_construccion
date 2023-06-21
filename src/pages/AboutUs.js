import { useEffect } from 'react';
import '../styles/AboutUs.css';
import GoBackButton from '../components/GenericAssets';
import {useNavigate, useParams} from 'react-router-dom';

import HdrStrongIcon from '@mui/icons-material/HdrStrong';

export default function AboutUs(){
    const navigate = useNavigate();

    return(
        <>
            <div className='generic_background'>
                <div className='generic_container'>
                    <div className='generic_form gap40' style={{width: 'calc(100% - 40px)', margin: '15px 0'}}>
                        {/* <img className='about_us_img' src={require('../img/logodrecfullsize.png')}/> */}
                        <div className='generic_list'>
                            <div><img className='generic_list_icon_img' src={require('../img/logodrecfullsize.png')}/><div className='generic_title font36 posL'><span className='about_us_title'>¿Qué es <span style={{color: '#ff7f22'}}>DREC</span>?</span></div></div>
                        </div>
                        
                        <div className='generic_description font20 posL gap20' style={{lineHeight: '25px'}}>
                            <span><span style={{color: '#ff7f22'}}>DREC</span> es el primer Marketplace creado para vincular a todas las empresas en el área de la construcción. Resolviendo las necesidades de los constructores al realizar cotizaciones y logrando una mayor accesibilidad a la hora de vincular constructores con clientes finales.</span>
                        </div>
                        <div className='generic_description font20 posL gap20' style={{lineHeight: '25px'}}>
                            <span><span style={{color: '#ff7f22'}}>DREC</span> busca ser la comunidad más grande en la industria de la construcción, logrando el acercamiento entre aliados, personal de trabajo y clientes.</span>
                        </div>
                        <div className='generic_list'>
                            <div><img className='generic_list_icon_img' src={require('../img/logodrecfullsize.png')}/><div className='generic_title font36 posL'>Misión</div></div>
                        </div>
                        <div className='generic_description font20 posL gap20' style={{lineHeight: '25px'}}>
                            <span><span style={{color: '#ff7f22'}}>DREC</span> será la comunidad más grande de la industria de la construcción, siendo el referente con mayor credibilidad a la hora de construir.</span>
                        </div>
                        <div className='generic_description font20 posL gap20' style={{lineHeight: '25px'}}>
                            <span><span style={{color: '#ff7f22'}}>DREC</span> no solo resolverá las necesidades de los constructores, también acreditará a quienes hacen una gran trabajo y los clientes tendrán referencias a la hora de tomar la decisión para otorgar sus proyectos.</span>
                        </div>
                        <div className='generic_list'>
                            <div><img className='generic_list_icon_img' src={require('../img/logodrecfullsize.png')}/><div className='generic_title font36 posL'>Objetivos</div></div>
                        </div>
                        <div className='generic_list font20'>
                            <div><HdrStrongIcon/><span>Resolver las necesidades de los contructores</span></div>
                            <div><HdrStrongIcon/><span>Dar accesibilidad a los clientes para el acercamiento a la construcción</span></div>
                            <div><HdrStrongIcon/><span>Ser la comunidad más grande en la industria de la construcción</span></div>
                            <div><HdrStrongIcon/><span>Ser el referente con mayor credibilidad a la hora de construir</span></div>
                            <div><HdrStrongIcon/><span>Erradicar las mala calidad en la construcción</span></div>
                            <div><HdrStrongIcon/><span>Apoyar a los productos y servicios en la construcción con mayor impacto positivo para la sociedad</span></div>
                        </div>
                        <div className='generic_list font30 posM gap40'>
                            <span><span style={{color: '#ff7f22'}}>D</span>emoler</span>
                            <span><span style={{color: '#ff7f22'}}>R</span>emodelar</span>
                            <span><span style={{color: '#ff7f22'}}>E</span>dificar</span>
                            <span><span style={{color: '#ff7f22'}}>C</span>onstruir</span>
                        </div>
                        <span className='posM font18' style={{fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.4)'}}>"Somos DREC, la construcción que une"</span>
                        <div className='generic_button font20' style={{backgroundColor: '#ff7f22'}} onClick={() => navigate('/categories2')}>
                            ¡Estoy Listo!
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}