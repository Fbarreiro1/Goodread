import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Book = ({ book }) => {
  return (
    <Card className='my-3 p-3 rounded' style={{ height: '100%' }}>
      <Link to={`/book/${book._id}`} style={{ textDecoration: 'none' }}>
        <Card.Img
          src={book.image}
          variant='top'
          className='book-image'
          alt={book.name}
        />
      </Link>

      <Card.Body>
        <Link to={`/book/${book._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div' className='book-title'>
            <strong>{book.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating value={book.rating} text={`${book.numReviews} reviews`} />
        </Card.Text>

        <Card.Text as='h3'>${book.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Book;
