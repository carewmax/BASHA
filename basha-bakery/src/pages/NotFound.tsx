import { Link } from '../router';

export function NotFound({ what = 'page' }: { what?: string }) {
  return (
    <div className="cream paper notfound">
      <div className="wrap">
        <h1 className="script">Oops!</h1>
        <p>We couldn't find that {what}.</p>
        <div className="row-btns center"><Link to="/menu" className="btn btn-gold">Browse the menu</Link><Link to="/" className="btn btn-dark">Go home</Link></div>
      </div>
    </div>
  );
}
