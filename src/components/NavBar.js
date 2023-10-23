import { Link } from "react-router-dom"
const Navbar =()=>{
      return (
            <div>
                  <Link to="/">Home</Link>
                  <Link to="/categories/1">Categories</Link>
                  <Link to="/services/43">Services</Link>
            </div>
      )
}
export default Navbar;