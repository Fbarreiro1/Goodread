import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetBooksQuery,
  useDeleteBookMutation,
  useCreateBookMutation,
} from '../../slices/booksApiSlice'; 
import { toast } from 'react-toastify';

const BookListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetBooksQuery({
    pageNumber, 
  });

  const [deleteBook, { isLoading: loadingDelete }] =
    useDeleteBookMutation(); 

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteBook(id); 
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createBook, { isLoading: loadingCreate }] =
    useCreateBookMutation(); 

  const createBookHandler = async () => {
    if (window.confirm('Are you sure you want to create a new book?')) {
      try {
        await createBook(); 
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Books</h1> {}
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createBookHandler}>
            <FaPlus /> Create Book {}
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.books.map((book) => ( 
                <tr key={book._id}>
                  <td>{book._id}</td>
                  <td>{book.name}</td>
                  <td>${book.price}</td>
                  <td>{book.category}</td>
                  <td>{book.brand}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/book/${book._id}/edit`} 
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(book._id)} 
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default BookListScreen;
