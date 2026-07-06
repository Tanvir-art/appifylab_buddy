import { Link } from 'react-router-dom';
export default function AuthBottomText({ 
  question = "Already have an account?",
  linkText = "Login here",
  linkTo = "/login",
  className = ""
}) {
  return (
    <div className="row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className={`_social_registration_bottom_txt ${className}`}>
          <p className="_social_registration_bottom_txt_para">
            {question} <Link to={linkTo}>{linkText}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}