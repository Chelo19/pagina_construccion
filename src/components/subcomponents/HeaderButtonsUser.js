import '../../styles/Header.css';

export default function HeaderButtonsUser(){
    return(
        <div>
            <a href='/Login' className='header_bottom_row_buttons_individual'>
            Login
            </a>
            <a href='/Register' className='header_bottom_row_buttons_individual'>
            Register
            </a>
        </div>
    )
}