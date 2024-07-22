import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from './Message';
import { useGetTopBooksQuery } from '../slices/booksApiSlice';

const BookCarousel = () => {
  const { data: books, isLoading, error } = useGetTopBooksQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='beige mb-4'>
      {books.map((book) => (
        <Carousel.Item key={book._id}>
          <Link to={`/book/${book._id}`} style={{ textDecoration: 'none' }}>
            <div className='carousel-item-content'>
              <div className='carousel-image'>
                <Image src={book.image} alt={book.name} fluid />
              </div>
              <div className='carousel-description '>
                <h2 className='text-black'>{book.name} (${book.price})</h2>
                <p className='text-black'>{book.description}</p>
              </div>
            </div>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BookCarousel;
